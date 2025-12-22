import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../shared/services/admin.service';

@Component({
  selector: 'app-admin-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-overview.component.html',
  styleUrl: './admin-overview.component.css',
})
export class AdminOverviewComponent implements OnInit {
  stats = {
    categories: 0,
    products: 0,
    news: 0,
    pdfs: 0,
  };

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.adminService.getCategories().subscribe((cats) => {
      this.stats.categories = cats.length;
    });
    this.adminService.getProducts().subscribe((prods) => {
      this.stats.products = prods.length;
    });
    this.adminService.getNewsArticles().subscribe((news) => {
      this.stats.news = news.length;
    });
    this.adminService.getPdfFiles().subscribe((pdfs) => {
      this.stats.pdfs = pdfs.length;
    });
  }
}
