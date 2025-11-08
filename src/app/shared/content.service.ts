import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay, map } from 'rxjs';

interface ContentRoot {
  navbar: any;
  footer: any;
  products: any[];
  contact: any;
  common?: any;
}

@Injectable({ providedIn: 'root' })
export class ContentService {
  private content$?: Observable<ContentRoot>;

  constructor(private http: HttpClient) {}

  getContent(): Observable<ContentRoot> {
    if (!this.content$) {
      this.content$ = this.http
        .get<ContentRoot>('assets/content.json')
        .pipe(shareReplay(1));
    }
    return this.content$;
  }

  getSection<T = any>(key: keyof ContentRoot): Observable<T> {
    return this.getContent().pipe(map((c) => c[key] as T));
  }
}
