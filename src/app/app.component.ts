import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';



@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class App implements OnInit {
  private authService = inject(AuthService);
  protected readonly title = signal('drx-frontend');

  ngOnInit(): void {
    // Check if user is already logged in (e.g., from localStorage)
    // This is where you might implement auto-login functionality
  }
}
