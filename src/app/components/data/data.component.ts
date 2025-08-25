import { Component, OnInit } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-data',
  template: `
    <div>
      <h2>Backend Data</h2>
      <button (click)="fetchData()">Fetch Data</button>
      <button (click)="sendData()">Send Data</button>
      
      @if (loading) {
        <div>Loading...</div>
      }
      
      @if (data) {
        <div>
          <h3>Response:</h3>
          <pre>{{ data | json }}</pre>
        </div>
      }
      
      @if (error) {
        <div class="error">
          <h3>Error:</h3>
          <pre>{{ error | json }}</pre>
        </div>
      }
    </div>
  `,
  styles: [`
    .error {
      color: red;
    }
  `],
  imports: [JsonPipe]
})
export class DataComponent implements OnInit {
  data: any = null;
  error: any = null;
  loading = false;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
  }

  fetchData(): void {
    this.loading = true;
    this.data = null;
    this.error = null;
    
    // Replace 'endpoint' with your actual backend endpoint
    // For example: 'users', 'products', 'orders', etc.
    // The full URL will be /api/users, /api/products, etc.
    this.apiService.getData('endpoint').subscribe({
      next: (response) => {
        this.loading = false;
        this.data = response;
      },
      error: (error) => {
        this.loading = false;
        this.error = error;
      }
    });
  }

  sendData(): void {
    this.loading = true;
    this.data = null;
    this.error = null;
    
    // Replace 'endpoint' with your actual backend endpoint
    // Replace the data object with your actual data
    const dataToSend = { message: 'Hello from Angular!' };
    
    this.apiService.postData('endpoint', dataToSend).subscribe({
      next: (response) => {
        this.loading = false;
        this.data = response;
      },
      error: (error) => {
        this.loading = false;
        this.error = error;
      }
    });
  }
}