import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsService } from '../../shared/services/news/news.service';
import { NewsArticle } from '../../shared/models/admin/admin.models';

@Component({
  selector: 'app-news-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './news-component.component.html',
  styleUrl: './news-component.component.css',
})
export class NewsComponentComponent implements OnInit {
  newsArticles: NewsArticle[] = [];
  loading = false;

  constructor(private newsService: NewsService) {}

  ngOnInit(): void {
    this.loadNews();
  }

  loadNews(): void {
    this.loading = true;
    this.newsService.getNews().subscribe({
      next: (news) => {
        this.newsArticles = news.sort(
          (a, b) =>
            new Date(b.publishDate).getTime() -
            new Date(a.publishDate).getTime()
        );
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching news:', err);
        this.loading = false;
      },
    });
  }
}
