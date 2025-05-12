import { Routes } from '@angular/router';

import { ChatbotComponent } from './chatbot/chatbot.component';
import { ChatbotUiStreamingComponent } from './chatbot-ui-streaming/chatbot-ui-streaming.component';

export const routes: Routes = [
  { path: '', redirectTo: 'chatbot', pathMatch: 'full' },
  { path: 'chatbot', component: ChatbotComponent },
  { path: 'chatbot-streaming', component: ChatbotUiStreamingComponent }
];
