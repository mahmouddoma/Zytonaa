import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { StorageService } from '../storage/storage.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import { environment } from '../../../../environments/environment';
import {
  LoginRequest,
  LoginResponse,
  ChangeInitialPasswordRequest,
  ChangeInitialPasswordResponse,
} from '../../models/auth/auth.models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly AUTH_KEY = 'auth_token';
  private readonly REFRESH_TOKEN_KEY = 'auth_refresh_token';
  private readonly USER_KEY = 'auth_user';
  private readonly ROLE_KEY = 'auth_role';
  private readonly PERMISSIONS_KEY = 'auth_permissions';
  private readonly REQUIRES_PASSWORD_CHANGE_KEY = 'requires_password_change';

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

  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${environment.apiUrl}/Auth/Login`, data)
      .pipe(
        map((response) => {
          if (response && response.token) {
            // Store the actual JWT token
            this.storageService.setItem(this.AUTH_KEY, response.token.token);
            // Store role and permissions
            this.storageService.setItem(this.ROLE_KEY, response.token.roleName);
            this.storageService.setItem(
              this.PERMISSIONS_KEY,
              JSON.stringify(response.token.permissions)
            );
            // Store password change requirement flag
            this.storageService.setItem(
              this.REQUIRES_PASSWORD_CHANGE_KEY,
              response.requiresPasswordChange.toString()
            );
            this.isAuthenticatedSubject.next(true);
            return response;
          }
          throw new Error('Invalid login response');
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

  changeInitialPassword(
    data: ChangeInitialPasswordRequest
  ): Observable<ChangeInitialPasswordResponse> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http
      .post<ChangeInitialPasswordResponse>(
        `${environment.apiUrl}/Auth/change-initial-password`,
        data,
        { headers }
      )
      .pipe(
        map((response) => {
          // Clear the password change requirement flag on success
          this.storageService.removeItem(this.REQUIRES_PASSWORD_CHANGE_KEY);
          return response;
        })
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
    this.storageService.removeItem(this.ROLE_KEY);
    this.storageService.removeItem(this.PERMISSIONS_KEY);
    this.storageService.removeItem(this.REQUIRES_PASSWORD_CHANGE_KEY);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/admin/login']);
  }

  isLoggedIn(): boolean {
    return this.checkAuth();
  }

  getToken(): string | null {
    return this.storageService.getItem(this.AUTH_KEY);
  }

  getRole(): string | null {
    return this.storageService.getItem(this.ROLE_KEY);
  }

  getPermissions(): string[] {
    const permissions = this.storageService.getItem<string>(
      this.PERMISSIONS_KEY
    );
    if (!permissions) return [];
    try {
      return JSON.parse(permissions);
    } catch {
      return [];
    }
  }

  requiresPasswordChange(): boolean {
    const flag = this.storageService.getItem(this.REQUIRES_PASSWORD_CHANGE_KEY);
    return flag === 'true';
  }
}
