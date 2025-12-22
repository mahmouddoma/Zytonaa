import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../shared/services/admin.service';
import { StorageService } from '../../../shared/services/storage.service';
import { NewsArticle } from '../../../shared/models/admin.models';

@Component({
  selector: 'app-admin-news',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-news.component.html',
  styleUrl: './admin-news.component.css',
})
export class AdminNewsComponent implements OnInit {
  newsArticles: NewsArticle[] = [];
  showModal = false;
  editMode = false;
  selectedArticle: NewsArticle | null = null;

  formData: NewsArticle = {
    title: '',
    content: '',
    image: '',
    publishDate: new Date(),
    author: 'المدير',
  };

  constructor(
    private adminService: AdminService,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    this.loadNews();
  }

  loadNews(): void {
    this.adminService.getNewsArticles().subscribe((news) => {
      this.newsArticles = news.sort(
        (a, b) =>
          new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
      );
    });
  }

  openAddModal(): void {
    this.editMode = false;
    this.formData = {
      title: '',
      content: '',
      image: '',
      publishDate: new Date(),
      author: 'المدير',
    };
    this.showModal = true;
  }

  openEditModal(article: NewsArticle): void {
    this.editMode = true;
    this.selectedArticle = article;
    this.formData = { ...article };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editMode = false;
    this.selectedArticle = null;
  }

  async onImageSelect(event: any): Promise<void> {
    const file = event.target.files[0];
    if (file) {
      try {
        this.formData.image = await this.storageService.imageToBase64(file);
      } catch (error) {
        console.error('Error converting image:', error);
        alert('حدث خطأ في رفع الصورة');
      }
    }
  }

  saveArticle(): void {
    if (
      !this.formData.title ||
      !this.formData.content ||
      !this.formData.image
    ) {
      alert('الرجاء ملء جميع الحقول واختيار صورة');
      return;
    }

    if (this.editMode && this.selectedArticle?.id) {
      this.adminService.updateNewsArticle(
        this.selectedArticle.id,
        this.formData
      );
    } else {
      this.adminService.addNewsArticle(this.formData);
    }

    this.closeModal();
  }

  deleteArticle(article: NewsArticle): void {
    if (confirm(`هل أنت متأكد من حذف المقال "${article.title}"؟`)) {
      if (article.id) {
        this.adminService.deleteNewsArticle(article.id);
      }
    }
  }
}
