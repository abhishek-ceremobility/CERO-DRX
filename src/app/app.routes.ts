import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
//import { NotFoundComponent } from './not-found/not-found.component';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth-module').then(m => m.AuthModule)
  },
  { path: '', pathMatch: 'full', redirectTo: 'auth' },
  // Uncomment if/when 404 page is ready
  // { path: '404', loadComponent: () => import('./not-found/not-found.component').then(c => c.NotFoundComponent) },
  // { path: '**', redirectTo: '404' }
];