import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../shared/services/product/product.service';
import { StorageService } from '../../../shared/services/storage/storage.service';
import { Product } from '../../../shared/models/admin/admin.models';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-products.component.html',
  styleUrl: './admin-products.component.css',
})
export class AdminProductsComponent implements OnInit {
  products: Product[] = [];
  showModal = false;
  editMode = false;
  selectedProduct: Product | null = null;

  formData: Product = {
    id: 0,
    name: '',
    desc: '',
    img: '',
  };

  selectedFile: File | null = null;

  constructor(
    private productService: ProductService,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (prods) => {
        this.products = prods;
      },
      error: (err) => {
        console.error('Error fetching products:', err);
      },
    });
  }

  openAddModal(): void {
    this.editMode = false;
    this.formData = {
      id: 0,
      name: '',
      desc: '',
      img: '',
    };
    this.showModal = true;
  }

  openEditModal(product: Product): void {
    this.editMode = true;
    this.selectedProduct = product;
    this.formData = { ...product };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editMode = false;
    this.selectedProduct = null;
  }

  async onImageSelect(event: any): Promise<void> {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      try {
        this.formData.img = await this.storageService.imageToBase64(file);
      } catch (error) {
        console.error('Error converting image:', error);
        alert('حدث خطأ في رفع الصورة');
      }
    }
  }

  saveProduct(): void {
    if (
      !this.formData.name ||
      !this.formData.desc ||
      (!this.selectedFile && !this.editMode)
    ) {
      alert('الرجاء ملء جميع الحقول واختيار صورة');
      return;
    }

    const formData = new FormData();
    formData.append('Name', this.formData.name);
    formData.append('Description', this.formData.desc);
    if (this.selectedFile) {
      formData.append('Image', this.selectedFile);
    }

    if (this.editMode && this.selectedProduct) {
      this.productService
        .updateProduct(this.selectedProduct.id, formData)
        .subscribe({
          next: () => {
            this.loadProducts();
            this.closeModal();
          },
          error: (err) => {
            console.error('Error updating product', err);
            alert('حدث خطأ أثناء تحديث المنتج');
          },
        });
    } else {
      this.productService.createProduct(formData).subscribe({
        next: () => {
          this.loadProducts();
          this.closeModal();
        },
        error: (err) => {
          console.error('Error creating product', err);
          alert('حدث خطأ أثناء إضافة المنتج');
        },
      });
    }
  }

  deleteProduct(product: Product): void {
    if (confirm(`هل أنت متأكد من حذف المنتج "${product.name}"؟`)) {
      this.productService.deleteProduct(product.id).subscribe({
        next: () => {
          this.loadProducts();
        },
        error: (err) => {
          console.error('Error deleting product', err);
          alert('حدث خطأ أثناء حذف المنتج');
        },
      });
    }
  }
}
