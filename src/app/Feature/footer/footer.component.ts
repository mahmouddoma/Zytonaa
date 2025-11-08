import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../shared/content.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent {
  year = new Date().getFullYear();
  data: any;

  constructor(private content: ContentService) {
    this.content.getSection<any>('footer').subscribe((f) => (this.data = f));
  }
}
