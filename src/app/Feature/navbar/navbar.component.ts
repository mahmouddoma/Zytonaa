import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ContentService } from '../../shared/content.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  brand: { name: string; logo: string } | null = null;
  links: Array<{ label: string; route: string; exact?: boolean }> = [];
  cta: { text: string; url: string } | null = null;

  constructor(private content: ContentService) {
    window.addEventListener('scroll', () => {
      const nav = document.querySelector('.custom-navbar');
      if (window.scrollY > 20) {
        nav?.classList.add('scrolled');
      } else {
        nav?.classList.remove('scrolled');
      }
    });
  }

  ngOnInit(): void {
    this.content.getSection<any>('navbar').subscribe((nv) => {
      this.brand = nv.brand;
      this.links = nv.links ?? [];
      this.cta = nv.cta ?? null;
    });
  }
}
