import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';
import { AdminService } from '../../../shared/services/admin.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
})
export class AdminDashboardComponent implements OnInit {
  sidebarOpen = true;
  stats = {
    categories: 0,
    products: 0,
    news: 0,
    pdfs: 0,
  };

  constructor(
    private authService: AuthService,
    private adminService: AdminService,
    private router: Router
  ) {}

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

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/admin/login']);
  }
}
