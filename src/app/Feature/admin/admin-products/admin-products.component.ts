import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../shared/services/admin.service';
import { StorageService } from '../../../shared/services/storage.service';
import { Product } from '../../../shared/models/admin.models';

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

  constructor(
    private adminService: AdminService,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.adminService.getProducts().subscribe((prods) => {
      this.products = prods;
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
      try {
        this.formData.img = await this.storageService.imageToBase64(file);
      } catch (error) {
        console.error('Error converting image:', error);
        alert('حدث خطأ في رفع الصورة');
      }
    }
  }

  saveProduct(): void {
    if (!this.formData.name || !this.formData.desc || !this.formData.img) {
      alert('الرجاء ملء جميع الحقول واختيار صورة');
      return;
    }

    if (this.editMode && this.selectedProduct) {
      this.adminService.updateProduct(this.selectedProduct.id, this.formData);
    } else {
      this.adminService.addProduct(this.formData);
    }

    this.closeModal();
  }

  deleteProduct(product: Product): void {
    if (confirm(`هل أنت متأكد من حذف المنتج "${product.name}"؟`)) {
      this.adminService.deleteProduct(product.id);
    }
  }
}
