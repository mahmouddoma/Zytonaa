import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { ChangeInitialPasswordRequest } from '../../../shared/models/auth/auth.models';

@Component({
  selector: 'app-admin-change-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-change-password.component.html',
  styleUrl: './admin-change-password.component.css',
})
export class AdminChangePasswordComponent {
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  errorMessage = '';
  successMessage = '';
  isLoading = false;
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  constructor(private authService: AuthService, private router: Router) {
    // Check if user is authenticated and requires password change
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/admin/login']);
      return;
    }

    if (!this.authService.requiresPasswordChange()) {
      // If they don't need to change password, redirect to dashboard
      this.router.navigate(['/admin']);
    }
  }

  togglePasswordVisibility(field: string): void {
    if (field === 'current') {
      this.showCurrentPassword = !this.showCurrentPassword;
    } else if (field === 'new') {
      this.showNewPassword = !this.showNewPassword;
    } else if (field === 'confirm') {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.isLoading = true;

    // Validation
    if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
      this.errorMessage = 'الرجاء إدخال جميع الحقول';
      this.isLoading = false;
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage =
        'كلمة المرور الجديدة وتأكيد كلمة المرور غير متطابقتين';
      this.isLoading = false;
      return;
    }

    if (this.newPassword.length < 6) {
      this.errorMessage = 'كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل';
      this.isLoading = false;
      return;
    }

    if (this.currentPassword === this.newPassword) {
      this.errorMessage =
        'كلمة المرور الجديدة يجب أن تكون مختلفة عن كلمة المرور الحالية';
      this.isLoading = false;
      return;
    }

    const changePasswordData: ChangeInitialPasswordRequest = {
      currentPassword: this.currentPassword,
      newPassword: this.newPassword,
    };

    this.authService.changeInitialPassword(changePasswordData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = 'تم تغيير كلمة المرور بنجاح! جاري التوجيه...';
        // Navigate to admin dashboard after a short delay
        setTimeout(() => {
          this.router.navigate(['/admin']);
        }, 1500);
      },
      error: (err) => {
        console.error('Password change error:', err);
        this.isLoading = false;
        if (err.status === 400) {
          this.errorMessage =
            'كلمة المرور الحالية غير صحيحة أو كلمة المرور الجديدة لا تطابق المتطلبات';
        } else {
          this.errorMessage =
            'حدث خطأ أثناء تغيير كلمة المرور. الرجاء المحاولة مرة أخرى';
        }
        this.currentPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';
      },
    });
  }
}
