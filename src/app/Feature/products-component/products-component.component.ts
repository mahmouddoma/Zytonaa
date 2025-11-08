import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ContentService } from '../../shared/content.service';

type Product = {
  id: number;
  name: string;
  desc: string;
  tag?: string;
  img: string;
};
@Component({
  selector: 'app-products-component',
  imports: [CommonModule],
  templateUrl: './products-component.component.html',
  styleUrl: './products-component.component.css',
})
export class ProductsComponentComponent {
  products: Product[] = [];
  title = '';
  subtitle = '';

  constructor(private content: ContentService) {
    this.content
      .getSection<Product[]>('products')
      .subscribe((p) => (this.products = p));
    this.content.getSection<any>('common').subscribe((c) => {
      const sec = c?.sections?.products;
      this.title = sec?.title || 'منتجاتنا';
      this.subtitle =
        sec?.subtitle || 'مجموعة أسمدة ورقية وجذرية وعناصر صغرى ومحفزات نمو.';
    });
  }
}
