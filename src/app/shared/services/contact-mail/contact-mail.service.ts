import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ContactMailService {
  private apiUrl = 'https://your-api-url.com/api/contact/send';

  constructor(private http: HttpClient) {}

  sendMessage(payload: {
    name: string;
    email: string;
    message: string;
  }): Observable<any> {
    return this.http.post(this.apiUrl, payload);
  }
}
