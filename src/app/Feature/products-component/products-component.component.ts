import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../shared/services/product/product.service';
import { Product } from '../../shared/models/admin/admin.models';

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

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe({
      next: (prods) => {
        this.products = prods;
      },
      error: (err) => {
        console.error('Error fetching products:', err);
      },
    });
  }

  openDetails(product: Product) {
    this.selectedProduct = product;
  }
}
