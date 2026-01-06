import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../shared/services/admin/admin.service';
import { StorageService } from '../../../shared/services/storage/storage.service';
import { Category } from '../../../shared/models/admin/admin.models';

import { CategoryService } from '../../../shared/services/category/category.service';

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
    private categoryService: CategoryService,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (cats) => {
        this.categories = cats;
      },
      error: (err) => {
        console.error('Error fetching categories:', err);
      },
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

  selectedFile: File | null = null;

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

  saveCategory(): void {
    if (!this.formData.name || (!this.selectedFile && !this.editMode)) {
      alert('الرجاء ملء جميع الحقول واختيار صورة');
      return;
    }

    const formData = new FormData();
    formData.append('Name', this.formData.name);
    formData.append('Size', this.formData.size);
    if (this.selectedFile) {
      formData.append('Image', this.selectedFile);
    }

    if (this.editMode && this.selectedCategory?.id) {
      this.categoryService
        .updateCategory(this.selectedCategory.id, formData)
        .subscribe({
          next: (res) => {
            this.loadCategories();
            this.closeModal();
          },
          error: (err) => {
            console.error('Error updating category', err);
            alert('حدث خطأ أثناء تحديث الفئة');
          },
        });
    } else {
      this.categoryService.createCategory(formData).subscribe({
        next: (res) => {
          this.loadCategories();
          this.closeModal();
        },
        error: (err) => {
          console.error('Error creating category', err);
          alert('حدث خطأ أثناء إضافة الفئة');
        },
      });
    }
  }

  deleteCategory(category: Category): void {
    if (confirm(`هل أنت متأكد من حذف الفئة "${category.name}"؟`)) {
      if (category.id) {
        this.categoryService.deleteCategory(category.id).subscribe({
          next: () => {
            this.loadCategories();
          },
          error: (err) => {
            console.error('Error deleting category', err);
            alert('حدث خطأ أثناء حذف الفئة');
          },
        });
      }
    }
  }
}
