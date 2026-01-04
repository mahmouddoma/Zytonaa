import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NewsService } from '../../../shared/services/news.service';
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

  selectedFile: File | null = null;

  constructor(
    private newsService: NewsService,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    this.loadNews();
  }

  loadNews(): void {
    this.newsService.getNews().subscribe({
      next: (news) => {
        this.newsArticles = news.sort(
          (a, b) =>
            new Date(b.publishDate).getTime() -
            new Date(a.publishDate).getTime()
        );
      },
      error: (err) => {
        console.error('Error fetching news:', err);
      },
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
      this.selectedFile = file;
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
      (!this.selectedFile && !this.editMode)
    ) {
      alert('الرجاء ملء جميع الحقول واختيار صورة');
      return;
    }

    const formData = new FormData();
    formData.append('Title', this.formData.title);
    formData.append('Content', this.formData.content);
    if (this.formData.author) {
      formData.append('Author', this.formData.author);
    }
    if (this.selectedFile) {
      formData.append('Image', this.selectedFile);
    }

    if (this.editMode && this.selectedArticle?.id) {
      this.newsService.updateNews(this.selectedArticle.id, formData).subscribe({
        next: () => {
          this.loadNews();
          this.closeModal();
        },
        error: (err) => {
          console.error('Error updating news', err);
          alert('حدث خطأ أثناء تحديث الخبر');
        },
      });
    } else {
      this.newsService.createNews(formData).subscribe({
        next: () => {
          this.loadNews();
          this.closeModal();
        },
        error: (err) => {
          console.error('Error creating news', err);
          alert('حدث خطأ أثناء إضافة الخبر');
        },
      });
    }
  }

  deleteArticle(article: NewsArticle): void {
    if (confirm(`هل أنت متأكد من حذف المقال "${article.title}"؟`)) {
      if (article.id) {
        this.newsService.deleteNews(article.id).subscribe({
          next: () => {
            this.loadNews();
          },
          error: (err) => {
            console.error('Error deleting news', err);
            alert('حدث خطأ أثناء حذف الخبر');
          },
        });
      }
    }
  }
}
