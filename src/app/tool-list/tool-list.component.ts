import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgxJsonViewerModule } from 'ngx-json-viewer';

interface Tool {
  name: string;
  description: string;
  inputSchema: any;
  annotations: any;
}

@Component({
  selector: 'app-tool-list',
  standalone: true,
  imports: [CommonModule, NgxJsonViewerModule],
  templateUrl: './tool-list.component.html',
  styleUrl: './tool-list.component.scss'
})
export class ToolListComponent {
  tools: Tool[] = [];
  loading = false;
  error: string | null = null;

  constructor(private http: HttpClient) {
    this.getTools();
  }

  getTools() {
    this.loading = true;
    this.error = null;
    this.http.get<Tool[]>('http://localhost:8000/tools').subscribe({
      next: (tools) => {
        this.tools = tools;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load tools.';
        this.loading = false;
      }
    });
  }

  refreshTools() {
    this.getTools();
  }
}
