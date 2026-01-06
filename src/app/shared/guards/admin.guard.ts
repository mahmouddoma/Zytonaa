import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // If trying to access login page, allow it
  if (state.url.includes('/admin/login')) {
    if (authService.isLoggedIn()) {
      // If already logged in, redirect to dashboard
      router.navigate(['/admin/overview']);
      return false;
    }
    return true;
  }

  // For other admin pages, check authentication
  if (authService.isLoggedIn()) {
    return true;
  } else {
    router.navigate(['/admin/login']);
    return false;
  }
};
