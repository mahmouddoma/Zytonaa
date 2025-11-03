import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact-component',
  imports: [FormsModule, CommonModule],
  templateUrl: './contact-component.component.html',
  styleUrl: './contact-component.component.css',
})
export class ContactComponentComponent {
  model = { name: '', email: '', message: '' };
  submit() {
    alert('تم إرسال رسالتك، سنعاود التواصل قريبًا.');
  }
}
