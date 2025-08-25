import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { authInterceptor } from './auth.interceptor';
import { of, throwError } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Injector } from '@angular/core';

describe('authInterceptor', () => {
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;
  let injector: Injector;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getToken', 'logout']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    injector = TestBed.inject(Injector);
  });

  it('should add Authorization header when token exists', () => {
    const req = new HttpRequest('GET', '/api/test');
    const next: HttpHandlerFn = (request) => {
      expect(request.headers.get('Authorization')).toBe('Bearer token123');
      return of({} as HttpEvent<unknown>);
    };

    // Set up the spy to return a token
    authService.getToken.and.returnValue('token123');

    // Call the interceptor within the injection context
    TestBed.runInInjectionContext(() => {
      const result$ = authInterceptor(req, next);
      
      // Subscribe to trigger the interceptor logic
      result$.subscribe();
    });
  });

  it('should not add Authorization header when token does not exist', () => {
    const req = new HttpRequest('GET', '/api/test');
    const next: HttpHandlerFn = (request) => {
      expect(request.headers.get('Authorization')).toBeNull();
      return of({} as HttpEvent<unknown>);
    };

    // Set up the spy to return null (no token)
    authService.getToken.and.returnValue(null);

    // Call the interceptor within the injection context
    TestBed.runInInjectionContext(() => {
      const result$ = authInterceptor(req, next);
      
      // Subscribe to trigger the interceptor logic
      result$.subscribe();
    });
  });

  it('should propagate error (e.g., 401)', (done) => {
    const req = new HttpRequest('GET', '/api/test');
    const next: HttpHandlerFn = () => throwError(() => ({ status: 401 }));

    // Set up the spy to return a token
    authService.getToken.and.returnValue('token123');

    TestBed.runInInjectionContext(() => {
      const result$ = authInterceptor(req, next);
      result$.subscribe({
        next: () => {},
        error: (err) => {
          expect(err.status).toBe(401);
          expect(authService.logout).toHaveBeenCalled();
          expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
          done();
        }
      });
    });
  });
});
