import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../shared/services/admin.service';
import { Category } from '../../shared/models/admin.models';

@Component({
  selector: 'app-home-component',
  imports: [RouterLink, CommonModule],
  templateUrl: './home-component.component.html',
  styleUrl: './home-component.component.css',
})
export class HomeComponentComponent implements OnInit {
  categories: Category[] = [];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.adminService.getCategories().subscribe((cats) => {
      this.categories = cats;
    });
  }
}
