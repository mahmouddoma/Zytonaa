import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  private http = inject(HttpClient);

  getNews(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/News`);
  }

  createNews(formData: FormData): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<any>(`${environment.apiUrl}/News`, formData, {
      headers,
    });
  }

  getNewsById(id: any): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<any>(`${environment.apiUrl}/News/${id}`, {
      headers,
    });
  }

  updateNews(id: any, formData: FormData): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.put<any>(`${environment.apiUrl}/News/${id}`, formData, {
      headers,
    });
  }

  deleteNews(id: any): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.delete<any>(`${environment.apiUrl}/News/${id}`, {
      headers,
    });
  }

  private getToken(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('auth_token');
    }
    return null;
  }
}
