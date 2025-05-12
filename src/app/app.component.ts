import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChatbotComponent } from "./chatbot/chatbot.component";
import { ToolListComponent } from './tool-list/tool-list.component';
import { MetadataComponent } from './metadata/metadata.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ChatbotComponent, ToolListComponent, MetadataComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'angular';
  showMetadataPanel = true;
  showToolsPanel = true;
}
