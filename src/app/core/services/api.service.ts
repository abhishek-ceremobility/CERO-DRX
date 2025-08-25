import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private apiUrl = environment.apiUrl; // e.g., http://localhost:4005

  constructor(private http: HttpClient) {}

  private request<T>(method: string, endpoint: string, data?: any): Observable<T> {
    // Ensure apiUrl doesn't end with '/' and endpoint doesn't start with '/'
    const base = this.apiUrl.endsWith('/') ? this.apiUrl.slice(0, -1) : this.apiUrl;
    const path = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
    // Ensure there's exactly one '/' between base and path
    const url = path ? `${base}/${path}` : base;

    switch (method) {
      case 'GET':
        return this.http.get<T>(url);
      case 'POST':
        return this.http.post<T>(url, data);
      case 'PUT':
        return this.http.put<T>(url, data);
      case 'DELETE':
        return this.http.delete<T>(url);
      default:
        throw new Error(`Unsupported request method: ${method}`);
    }
  }

  getData<T>(endpoint: string): Observable<T> {
    return this.request<T>('GET', endpoint);
  }

  postData<T>(endpoint: string, data: any): Observable<T> {
    return this.request<T>('POST', endpoint, data);
  }

  putData<T>(endpoint: string, data: any): Observable<T> {
    return this.request<T>('PUT', endpoint, data);
  }

  deleteData<T>(endpoint: string): Observable<T> {
    return this.request<T>('DELETE', endpoint);
  }
}
