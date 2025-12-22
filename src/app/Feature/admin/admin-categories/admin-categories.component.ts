import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../shared/services/admin.service';
import { StorageService } from '../../../shared/services/storage.service';
import { Category } from '../../../shared/models/admin.models';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-categories.component.html',
  styleUrl: './admin-categories.component.css',
})
export class AdminCategoriesComponent implements OnInit {
  categories: Category[] = [];
  showModal = false;
  editMode = false;
  selectedCategory: Category | null = null;

  formData: Category = {
    name: '',
    img: '',
    size: 'small',
  };

  constructor(
    private adminService: AdminService,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.adminService.getCategories().subscribe((cats) => {
      this.categories = cats;
    });
  }

  openAddModal(): void {
    this.editMode = false;
    this.formData = {
      name: '',
      img: '',
      size: 'small',
    };
    this.showModal = true;
  }

  openEditModal(category: Category): void {
    this.editMode = true;
    this.selectedCategory = category;
    this.formData = { ...category };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editMode = false;
    this.selectedCategory = null;
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

  saveCategory(): void {
    if (!this.formData.name || !this.formData.img) {
      alert('الرجاء ملء جميع الحقول واختيار صورة');
      return;
    }

    if (this.editMode && this.selectedCategory?.id) {
      this.adminService.updateCategory(this.selectedCategory.id, this.formData);
    } else {
      this.adminService.addCategory(this.formData);
    }

    this.closeModal();
  }

  deleteCategory(category: Category): void {
    if (confirm(`هل أنت متأكد من حذف الفئة "${category.name}"؟`)) {
      if (category.id) {
        this.adminService.deleteCategory(category.id);
      }
    }
  }
}
