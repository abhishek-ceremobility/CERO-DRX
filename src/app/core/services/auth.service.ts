// import { Injectable, inject } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { map } from 'rxjs/operators';
// import { environment } from '../../../environments/environment';

// export interface LoginRequest {
//   email: string;
//   password: string;
// }

// export interface LoginResponse {
//   token: string;
//   user?: {
//     id?: number;
//     username?: string;
//     email?: string;
//   };
// }

// export interface AuthResponse {
//   success?: boolean;
//   message?: string;
//   data?: LoginResponse;
//   token?: string; // Support flat token responses
// }

// @Injectable({ providedIn: 'root' })
// export class AuthService {
//   private http = inject(HttpClient);

//   private isAuthenticated = false;
//   private token: string | null = null;

//   constructor() {
//     const savedToken = localStorage.getItem('token');
//     if (savedToken) {
//       this.token = savedToken;
//       this.isAuthenticated = true;
//     }
//   }

//   // Integrate with backend: POST http://localhost:4005/api/users/login
//   // Accepts { email, password } and stores token from common response shapes
//   login(email: string, password: string): Observable<AuthResponse> {
//     const loginData: LoginRequest = { email, password };

//     return this.http.post<AuthResponse>(`${environment.apiUrl}/api/users/login`, loginData).pipe(
//       map((response: AuthResponse) => {
//         // Try common response shapes
//         const token =
//           response?.token || // flat { token }
//           response?.data?.token || // { data: { token } }
//           // Some APIs return { accessToken } or nested data
//           (response as any)?.accessToken ||
//           (response as any)?.data?.accessToken;

//         if (token) {
//           this.setToken(token as string);
//         }
//         return response;
//       })
//     );
//   }

//   logout(): void {
//     this.token = null;
//     this.isAuthenticated = false;
//     localStorage.removeItem('token');
//   }

//   setToken(token: string): void {
//     this.token = token;
//     this.isAuthenticated = true;
//     localStorage.setItem('token', token);
//   }

//   getToken(): string | null {
//     return this.token;
//   }

//   isLoggedIn(): boolean {
//     return this.isAuthenticated;
//   }
// }


//refrsh token scene
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  authToken: string;
  refreshToken: string;
  expiresIn?: string;
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
  token?: string; // fallback
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);

  private token: string | null = null;
  private refresh: string | null = null;

  constructor() {
    const savedData = localStorage.getItem('authData');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      this.token = parsed.authToken;
      this.refresh = parsed.refreshToken;
    }
  }

  login(email: string, password: string): Observable<AuthResponse> {
    const loginData: LoginRequest = { email, password };

    return this.http.post<AuthResponse>(`${environment.apiUrl}/api/users/login`, loginData).pipe(
      map((response: any) => {
        // Normalize response
        const authToken =
          response?.token ||
          response?.data?.token ||
          response?.authToken ||
          response?.data?.authToken;

        const refreshToken =
          response?.refreshToken ||
          response?.data?.refreshToken;

        if (authToken && refreshToken) {
          this.setTokens(authToken, refreshToken);
        }
        return response;
      })
    );
  }

  logout(): void {
    this.token = null;
    this.refresh = null;
    localStorage.removeItem('authData');
  }

  setTokens(authToken: string, refreshToken: string): void {
    this.token = authToken;
    this.refresh = refreshToken;
    localStorage.setItem('authData', JSON.stringify({ authToken, refreshToken }));
  }

  getToken(): string | null {
    return this.token;
  }

  getRefreshToken(): string | null {
    return this.refresh;
  }

  refreshToken(): Observable<any> {
    if (!this.refresh) return throwError(() => new Error('No refresh token available'));

    return this.http.post(`${environment.apiUrl}/api/users/refresh`, { refreshToken: this.refresh }).pipe(
      map((res: any) => {
        const newToken = res?.authToken || res?.token;
        const newRefresh = res?.refreshToken || this.refresh;

        if (newToken) {
          this.setTokens(newToken, newRefresh);
        }
        return newToken;
      }),
      catchError(err => {
        this.logout();
        return throwError(() => err);
      })
    );
  }

  isLoggedIn(): boolean {
    return !!this.token;
  }
}
