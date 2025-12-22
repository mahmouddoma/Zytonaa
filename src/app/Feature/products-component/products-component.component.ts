import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../shared/services/admin.service';
import { Product } from '../../shared/models/admin.models';

@Component({
  selector: 'app-products-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products-component.component.html',
  styleUrl: './products-component.component.css',
})
export class ProductsComponentComponent implements OnInit {
  selectedProduct: Product | null = null;
  products: Product[] = [];
  title = 'منتجاتنا السبع المميزة';
  subtitle = 'اكتشف مجموعتنا المختارة من أفضل الأسمدة والمخصبات الزراعية.';

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.adminService.getProducts().subscribe((prods) => {
      this.products = prods;
    });
  }

  openDetails(product: Product) {
    this.selectedProduct = product;
  }
}
