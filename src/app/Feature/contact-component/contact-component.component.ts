import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ContentService } from '../../shared/content.service';



@Component({
  selector: 'app-contact-component',
  imports: [CommonModule, FormsModule],
  templateUrl: './contact-component.component.html',
  styleUrls: ['./contact-component.component.css'],
})
export class ContactComponentComponent {
  model = { name: '', email: '', message: '' };

  title = '';
  intro = '';
  info: { address?: string; phone?: string; email?: string } = {};
  mapUrl = '';
  labels = { name: 'الاسم', email: 'البريد الإلكتروني', message: 'الرسالة' };
  placeholders = {
    name: 'الاسم الكامل',
    email: 'name@example.com',
    message: 'اكتب رسالتك هنا...',
  };
  buttons = { send: 'إرسال', cancel: 'إلغاء' };
  successMessage = 'تم إرسال رسالتك، سنعاود التواصل قريبًا.';

  constructor(private content: ContentService) {
    this.content.getSection<any>('contact').subscribe((c) => {
      this.title = c?.title || this.title;
      this.intro = c?.intro || this.intro;
      this.info = c?.info || this.info;
      this.mapUrl = c?.mapUrl || this.mapUrl;
      this.labels = c?.form?.labels || this.labels;
      this.placeholders = c?.form?.placeholders || this.placeholders;
      this.buttons = c?.form?.buttons || this.buttons;
      this.successMessage = c?.form?.successMessage || this.successMessage;
    });
  }

  submit() {
    alert(this.successMessage);
  }
}
