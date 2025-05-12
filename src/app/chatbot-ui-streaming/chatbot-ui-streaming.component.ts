import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MarkdownModule } from 'ngx-markdown';
import { ResponseDetailsComponent } from '../chatbot/response-details/response-details.component';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  responseDetails?: any;
  showDetails?: boolean;
}

@Component({
  selector: 'app-chatbot-ui-streaming',
  standalone: true,
  imports: [CommonModule, FormsModule, MarkdownModule, ResponseDetailsComponent],
  templateUrl: './chatbot-ui-streaming.component.html',
  styleUrl: './chatbot-ui-streaming.component.scss'
})
export class ChatbotUiStreamingComponent {
  messages: ChatMessage[] = [];
  input: string = '';
  loading = false;

  newConversation() {
    this.messages = [];
    this.input = '';
  }

  async sendMessage() {
    if (!this.input.trim()) return;
    const userMsg: ChatMessage = { role: 'user', content: this.input };
    this.messages.push(userMsg);
    this.loading = true;
    const aiMsg: ChatMessage = { role: 'assistant', content: '' };
    this.messages.push(aiMsg);
    const query = this.input;
    this.input = '';

    // Streaming fetch
    try {
      const response = await fetch('http://localhost:8000/query-stream-function-calling', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          llm_choice: 'openai',
          query,
          tool_choice: 'auto',
          parallel_tool_calls: true
        })
      });
      if (!response.body) throw new Error('No stream');
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let buffer = '';
      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          buffer += decoder.decode(value, { stream: true });
          // Split by newlines for SSE-like events
          const lines = buffer.split('\n');
          buffer = lines.pop() ?? '';
          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;
            // Remove 'message' prefix and whitespace if present
            const jsonStart = trimmed.indexOf('{');
            if (jsonStart === -1) continue;
            const jsonStr = trimmed.slice(jsonStart);
            try {
              const data = JSON.parse(jsonStr);
              if (data.delta) {
                aiMsg.content += data.delta;
              } else if (data.type=="response.output_item.added" && data.item.type =="function_call") {
                aiMsg.content +=  data.item.name+"\n";
              } else if (data.type=="response.output_item.done") {
                aiMsg.content += "  \n"
              }
              // If this is the last message and type is full_flow, attach responseDetails
              if (data.type === 'full_flow') {
                aiMsg['responseDetails'] = data;
              }
            } catch {}
          }
        }
      }
    } catch (err) {
      aiMsg.content += '\n[Error: ' + err + ']';
    }
    this.loading = false;
  }
}
