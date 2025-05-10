import { Component, Input } from '@angular/core';

import { CommonModule } from '@angular/common';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
@Component({
  selector: 'app-response-details',
  standalone: true,
  imports: [CommonModule, NgxJsonViewerModule],
  templateUrl: './response-details.component.html',
  styleUrl: './response-details.component.scss'
})
export class ResponseDetailsComponent {
  @Input() response: any;
  expanded = false;
  toolExpanded = false; // For folding tool details
  flowExpanded = true; // For collapsing/expanding the flow array

  get flowTypeSummary(): string {
    return this.response?.flow?.map((step: any) => step.type).join(', ') || '';
  }

  toggleDetails() {
    this.expanded = !this.expanded;
  }
}
