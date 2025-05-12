import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatbotUiStreamingComponent } from './chatbot-ui-streaming.component';

describe('ChatbotUiStreamingComponent', () => {
  let component: ChatbotUiStreamingComponent;
  let fixture: ComponentFixture<ChatbotUiStreamingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatbotUiStreamingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChatbotUiStreamingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
