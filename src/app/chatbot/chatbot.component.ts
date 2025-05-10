import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResponseDetailsComponent } from './response-details/response-details.component';
import { MarkdownModule } from 'ngx-markdown';

interface Message {
  sender: 'user' | 'bot';
  text: string;
  responseDetails?: any; // For bot messages, holds the full response object
  showDetails?: boolean; // For toggling details display
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule, ResponseDetailsComponent, MarkdownModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss'],
})
export class ChatbotComponent {
  messages: Message[] = [];
  userInput = '';
  loading = false;
  selectedResponse: any = null;

  // Tool choice UI state
  toolChoice: 'auto' | 'required' | 'none' | 'function' = 'auto';
  forcedFunctionName: string = '';
  availableFunctions: string[] = [];

  constructor(private http: HttpClient) {
    this.fetchAvailableFunctions();
  }

  fetchAvailableFunctions() {
    this.http.get<any[]>('http://localhost:8000/tools').subscribe({
      next: (tools) => {
        // Assume each tool has a 'name' property
        this.availableFunctions = Array.isArray(tools) ? tools.map(t => t.name).filter(Boolean) : [];
      },
      error: () => {
        this.availableFunctions = [];
      }
    });
  }

  toggleDetails(msg: Message) {
    msg.showDetails = !msg.showDetails;
  }

  sendMessage() {
    const input = this.userInput.trim();
    if (!input) return;
    this.messages.push({ sender: 'user', text: input });
    this.userInput = '';
    this.loading = true;

    // Build tool_choice param
    let tool_choice: any;
    if (this.toolChoice === 'auto') {
      tool_choice = 'auto';
    } else if (this.toolChoice === 'required') {
      tool_choice = 'required';
    } else if (this.toolChoice === 'none') {
      tool_choice = 'none';
    } else if (this.toolChoice === 'function' && this.forcedFunctionName) {
      tool_choice = { type: 'function', name: this.forcedFunctionName };
    } else {
      tool_choice = 'auto';
    }

    this.http.post<any>('http://localhost:8000/query', { llm_choice: 'openai', query: input, tool_choice }).subscribe({
      next: (res) => {
        const response = res?.response;
        if (response?.final_answer) {
          this.messages.push({ sender: 'bot', text: response.final_answer, responseDetails: response, showDetails: false });
        } else if (typeof res?.response === 'string') {
          this.messages.push({ sender: 'bot', text: res.response });
        } else {
          this.messages.push({ sender: 'bot', text: 'Received an unexpected response.', responseDetails: response, showDetails: false });
        }
        this.selectedResponse = null; // No longer used
        this.loading = false;
      },
      error: () => {
        this.messages.push({ sender: 'bot', text: 'Sorry, something went wrong.' });
        this.selectedResponse = null;
        this.loading = false;
      }
    });
  }
}



