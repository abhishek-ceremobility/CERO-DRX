import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user?: {
    id?: number;
    username?: string;
    email?: string;
  };
}

export interface AuthResponse {
  success?: boolean;
  message?: string;
  data?: LoginResponse;
  token?: string; // Support flat token responses
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);

  private isAuthenticated = false;
  private token: string | null = null;

  constructor() {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      this.token = savedToken;
      this.isAuthenticated = true;
    }
  }

  // Integrate with backend: POST http://localhost:4005/api/users/login
  // Accepts { email, password } and stores token from common response shapes
  login(email: string, password: string): Observable<AuthResponse> {
    const loginData: LoginRequest = { email, password };

    return this.http.post<AuthResponse>(`${environment.apiUrl}/api/users/login`, loginData).pipe(
      map((response: AuthResponse) => {
        // Try common response shapes
        const token =
          response?.token || // flat { token }
          response?.data?.token || // { data: { token } }
          // Some APIs return { accessToken } or nested data
          (response as any)?.accessToken ||
          (response as any)?.data?.accessToken;

        if (token) {
          this.setToken(token as string);
        }
        return response;
      })
    );
  }

  logout(): void {
    this.token = null;
    this.isAuthenticated = false;
    localStorage.removeItem('token');
  }

  setToken(token: string): void {
    this.token = token;
    this.isAuthenticated = true;
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return this.token;
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated;
  }
}
