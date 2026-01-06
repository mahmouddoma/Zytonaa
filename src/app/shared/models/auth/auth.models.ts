export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenInfo {
  token: string;
  roleName: string;
  permissions: string[];
}

export interface LoginResponse {
  requiresPasswordChange: boolean;
  token: TokenInfo;
}

export interface ChangeInitialPasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ChangeInitialPasswordResponse {
  success: boolean;
  message?: string;
}
