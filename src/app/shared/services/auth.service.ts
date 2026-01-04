import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { StorageService } from './storage.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly AUTH_KEY = 'auth_token';
  private readonly REFRESH_TOKEN_KEY = 'auth_refresh_token';
  private readonly USER_KEY = 'auth_user';

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private storageService: StorageService,
    private http: HttpClient,
    private router: Router
  ) {
    this.isAuthenticatedSubject.next(this.checkAuth());
  }

  private checkAuth(): boolean {
    if (typeof window !== 'undefined' && window.localStorage) {
      return !!this.storageService.getItem(this.AUTH_KEY);
    }
    return false;
  }

  login(data: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/Auth/login`, data).pipe(
      map((response) => {
        if (response && response.token) {
          this.storageService.setItem(this.AUTH_KEY, response.token);
          if (response.refreshToken) {
            this.storageService.setItem(
              this.REFRESH_TOKEN_KEY,
              response.refreshToken
            );
          }
          if (response.user) {
            this.storageService.setItem(this.USER_KEY, response.user);
          }
          this.isAuthenticatedSubject.next(true);
          return response;
        }
        return null;
      })
    );
  }

  refreshToken(): Observable<any> {
    const refreshToken = this.storageService.getItem(this.REFRESH_TOKEN_KEY);
    return this.http
      .post<any>(`${environment.apiUrl}/Auth/refresh-token`, {
        refreshToken: refreshToken,
      })
      .pipe(
        map((response) => {
          if (response && response.token) {
            this.storageService.setItem(this.AUTH_KEY, response.token);
            if (response.refreshToken) {
              this.storageService.setItem(
                this.REFRESH_TOKEN_KEY,
                response.refreshToken
              );
            }
            return response;
          }
          return null;
        })
      );
  }

  getCurrentUser(): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<any>(`${environment.apiUrl}/Auth/me`, { headers });
  }

  changePassword(data: any): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<any>(
      `${environment.apiUrl}/Auth/change-password`,
      data,
      { headers }
    );
  }

  logout(): void {
    const refreshToken = this.storageService.getItem(this.REFRESH_TOKEN_KEY);
    if (refreshToken) {
      this.http
        .post(`${environment.apiUrl}/Auth/logout`, { refreshToken })
        .subscribe({
          complete: () => this.performLogoutCleanup(),
          error: () => this.performLogoutCleanup(),
        });
    } else {
      this.performLogoutCleanup();
    }
  }

  private performLogoutCleanup(): void {
    this.storageService.removeItem(this.AUTH_KEY);
    this.storageService.removeItem(this.REFRESH_TOKEN_KEY);
    this.storageService.removeItem(this.USER_KEY);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/admin/login']);
  }

  isLoggedIn(): boolean {
    return this.checkAuth();
  }

  getToken(): string | null {
    return this.storageService.getItem(this.AUTH_KEY);
  }
}
