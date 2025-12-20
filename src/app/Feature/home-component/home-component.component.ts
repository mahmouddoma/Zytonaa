import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home-component',
  imports: [RouterLink, CommonModule],
  templateUrl: './home-component.component.html',
  styleUrl: './home-component.component.css',
})
export class HomeComponentComponent {
   categories = [
    {
      name: 'منظمات النمو',
      img: 'assets/images/1765821612465.jpg',
      size: 'large',
    },
    {
      name: 'مغذيات نباتية',
      img: 'assets/images/1765891184328.jpg',
      size: 'small',
    },
    {
      name: 'أسمدة سائلة',
      img: 'assets/images/1765891268333.jpg',
      size: 'small',
    },
    {
      name: 'محفزات نمو',
      img: 'assets/images/1765891276258.jpg',
      size: 'large',
    },
    {
      name: 'مخصبات حيوية',
      img: 'assets/images/1765821549773.jpg',
      size: 'small',
    },
  ];
}
