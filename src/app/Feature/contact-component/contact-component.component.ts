import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ContentService } from '../../shared/services/content/content.service';
import { ContactMailService } from '../../shared/services/contact-mail/contact-mail.service';

interface ContactInfo {
  address: string;
  email: string;
  phones: string[];
}

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
  info: ContactInfo = { address: '', email: '', phones: [] };
  mapUrl = '';

  labels = { name: 'الاسم', email: 'البريد الإلكتروني', message: 'الرسالة' };

  placeholders = {
    name: 'الاسم الكامل',
    email: 'name@example.com',
    message: 'اكتب رسالتك هنا...',
  };

  buttons = { send: 'إرسال', cancel: 'إلغاء' };
  successMessage = 'تم إرسال رسالتك، سنعاود التواصل قريبًا.';
  isSending = false;

  constructor(
    private content: ContentService,
    private mailService: ContactMailService
  ) {
    this.content.getSection<any>('contact').subscribe((c) => {
      if (!c) return;

      this.title = c.title || this.title;
      this.intro = c.intro || this.intro;

      const ci = c.info || {};
      this.info = {
        address: ci.address || this.info.address,
        email: ci.email || this.info.email,
        phones: Array.isArray(ci.phones)
          ? ci.phones
          : [ci.phone].filter((x: string) => !!x),
      };

      this.mapUrl = c.mapUrl || this.mapUrl;
      this.labels = c.form?.labels || this.labels;
      this.placeholders = c.form?.placeholders || this.placeholders;
      this.buttons = c.form?.buttons || this.buttons;
      this.successMessage = c.form?.successMessage || this.successMessage;
    });
  }

  submitEmail() {
    if (!this.model.name || !this.model.email || !this.model.message) return;

    const subject = encodeURIComponent('رسالة جديدة من نموذج التواصل - زيتونة');
    const body = encodeURIComponent(
      `الاسم: ${this.model.name}\nالبريد: ${this.model.email}\n\n${this.model.message}`
    );

    window.location.href = `mailto:zaytona@zaytona.info?subject=${subject}&body=${body}`;
  }

  submitWhatsApp() {
    if (!this.model.name || !this.model.message) return;

    const text = encodeURIComponent(
      `مرحباً شركة زيتونة،\nالاسم: ${this.model.name}\n\n${this.model.message}`
    );

    // Using the phone number from content.json: +201066670226
    const phone = '201066670226';
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  }
}
