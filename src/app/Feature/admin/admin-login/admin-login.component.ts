import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { LoginRequest } from '../../../shared/models/auth/auth.models';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.css',
})
export class AdminLoginComponent {
  email = '';
  password = '';
  errorMessage = '';
  showPassword = false;
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.isLoading = true;

    if (!this.email || !this.password) {
      this.errorMessage = 'الرجاء إدخال البريد الإلكتروني وكلمة المرور';
      this.isLoading = false;
      return;
    }

    const loginData: LoginRequest = {
      email: this.email,
      password: this.password,
    };

    this.authService.login(loginData).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.requiresPasswordChange) {
          // Navigate to password change page
          this.router.navigate(['/admin/change-password']);
        } else {
          // Navigate to admin dashboard
          this.router.navigate(['/admin']);
        }
      },
      error: (err) => {
        console.error('Login error:', err);
        this.isLoading = false;
        this.errorMessage = 'البريد الإلكتروني أو كلمة المرور غير صحيحة';
        this.password = '';
      },
    });
  }
}
