import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject, Injector, runInInjectionContext } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  // Try to get the injector from the current context, or create a new one if not available
  try {
    return runInInjectionContext(inject(Injector), () => {
      const auth = inject(AuthService);
      const router = inject(Router);

      let authReq = req;
      const token = auth.getToken();
      if (token) {
        authReq = req.clone({
          setHeaders: { Authorization: `Bearer ${token}` },
        });
      }
      return next(authReq).pipe(
        catchError((err) => {
          if (err.status === 401) {
            auth.logout();
            router.navigate(['/auth/login']);
          }
          return throwError(() => err);
        })
      );
    });
  } catch (e) {
    // Fallback for cases where injection context is not available
    // This should only happen in some test scenarios
    return next(req);
  }
};
