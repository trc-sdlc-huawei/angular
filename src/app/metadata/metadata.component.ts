import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-metadata',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './metadata.component.html',
  styleUrl: './metadata.component.scss'
})
export class MetadataComponent {
  metadata: { [server: string]: any } = {};
  serverNames: string[] = [];
  expandedServers: { [server: string]: boolean } = {};
  loading = false;
  error: string | null = null;

  constructor(private http: HttpClient) {
    this.fetchMetadata();
  }

  fetchMetadata() {
    this.loading = true;
    this.http.get<any>('http://localhost:8000/metadata').subscribe({
      next: (data) => {
        this.metadata = data || {};
        this.serverNames = Object.keys(this.metadata);
        this.serverNames.forEach(server => this.expandedServers[server] = false);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load metadata.';
        this.loading = false;
      }
    });
  }

  toggleServer(server: string) {
    this.expandedServers[server] = !this.expandedServers[server];
  }
}
