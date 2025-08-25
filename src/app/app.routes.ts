import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { NotFoundComponent } from './not-found/not-found.component';

export const routes: Routes = [

{
    path: 'auth',
    loadChildren: () => import('./features/auth/auth-module').then(m => m.AuthModule)
  },


  {
    path: 'legal/privacy',
    loadComponent: () => import('./features/legal/privacy/privacy.component').then(c => c.PrivacyComponent)
  },
  {
    path: 'legal/terms',
    loadComponent: () => import('./features/legal/terms/terms.component').then(c => c.TermsComponent)
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/dashboard/dashboard.component').then(c => c.DashboardComponent)
  },
  { path: '', pathMatch: 'full', redirectTo: 'auth' },
  { path: '404', loadComponent: () => import('./not-found/not-found.component').then(c => c.NotFoundComponent) },
  { path: '**', redirectTo: '404' }
];