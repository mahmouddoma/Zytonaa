import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { StorageService } from './storage.service';
import { AdminUser } from '../models/admin.models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly AUTH_KEY = 'admin_authenticated';
  private readonly DEFAULT_USERNAME = 'admin';
  private readonly DEFAULT_PASSWORD = 'admin123';

  private isAuthenticatedSubject!: BehaviorSubject<boolean>;
  public isAuthenticated$!: Observable<boolean>;

  constructor(private storageService: StorageService) {
    this.isAuthenticatedSubject = new BehaviorSubject<boolean>(
      this.checkAuth()
    );
    this.isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  }

  private checkAuth(): boolean {
    return this.storageService.getItem<boolean>(this.AUTH_KEY) === true;
  }

  login(username: string, password: string): boolean {
    if (
      username === this.DEFAULT_USERNAME &&
      password === this.DEFAULT_PASSWORD
    ) {
      this.storageService.setItem(this.AUTH_KEY, true);
      this.isAuthenticatedSubject.next(true);
      return true;
    }
    return false;
  }

  logout(): void {
    this.storageService.removeItem(this.AUTH_KEY);
    this.isAuthenticatedSubject.next(false);
  }
  isLoggedIn(): boolean {
    return this.checkAuth();
  }
}
