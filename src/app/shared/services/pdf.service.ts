import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PdfService {
  private http = inject(HttpClient);

  getPdfs(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/Pdfs`);
  }

  createPdf(formData: FormData): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<any>(`${environment.apiUrl}/Pdfs`, formData, {
      headers,
    });
  }

  getPdfById(id: any): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<any>(`${environment.apiUrl}/Pdfs/${id}`, {
      headers,
    });
  }

  updatePdf(id: any, formData: FormData): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.put<any>(`${environment.apiUrl}/Pdfs/${id}`, formData, {
      headers,
    });
  }

  deletePdf(id: any): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.delete<any>(`${environment.apiUrl}/Pdfs/${id}`, {
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
