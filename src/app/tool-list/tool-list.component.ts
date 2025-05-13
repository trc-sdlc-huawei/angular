import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgxJsonViewerModule } from 'ngx-json-viewer';

interface Tool {
  name: string;
  description: string;
  parameters: any;
  [key: string]: any;
}

interface ServerToolsDict {
  [server: string]: Tool[];
}

@Component({
  selector: 'app-tool-list',
  standalone: true,
  imports: [CommonModule, NgxJsonViewerModule],
  templateUrl: './tool-list.component.html',
  styleUrl: './tool-list.component.scss'
})
export class ToolListComponent {
  rawTools: ServerToolsDict = {};
  rawToolsFull: { [server: string]: any } = {};
  rawServerNames: string[] = [];
  expandedServers: { [key: string]: boolean } = {};
  loading = false;
  error: string | null = null;
  // UI state for collapsible panels
  showRawTools = false;

  constructor(private http: HttpClient) {
    this.getAllTools();
  }

  getAllTools() {
    this.loading = true;
    this.error = null;
    let rawDone = false;
    this.http.get<any>('http://localhost:8000/raw-tools').subscribe({
      next: (toolsRaw) => {
        // Store the full server object for each server
        this.rawToolsFull = toolsRaw;
        // Normalize raw tools: { server: { tools: Tool[], ... } } => { server: Tool[] }
        const normalized: ServerToolsDict = {};
        Object.keys(toolsRaw).forEach(server => {
          const entry = toolsRaw[server];
          if (entry && Array.isArray(entry.tools)) {
            normalized[server] = entry.tools;
          } else {
            normalized[server] = [];
          }
        });
        this.rawTools = normalized;
        this.rawServerNames = Object.keys(normalized);
        this.rawServerNames.forEach(server => this.expandedServers['raw-' + server] = false);
        rawDone = true;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load raw tools.';
        rawDone = true;
        this.loading = false;
      }
    });
  }

  refreshTools() {
    this.getAllTools();
  }

  toggleServer(prefix: string, server: string) {
    this.expandedServers[prefix + '-' + server] = !this.expandedServers[prefix + '-' + server];
  }

  // OpenAI tools toggling removed
  toggleRawTools() {
    this.showRawTools = !this.showRawTools;
  }

  // OpenAI server count removed
  get totalRawServers(): number {
    return this.rawServerNames.length;
  }

  // OpenAI tools count removed
  get totalRawTools(): number {
    return this.rawServerNames.reduce((sum, server) => sum + (this.rawTools[server]?.length || 0), 0);
  }
}
