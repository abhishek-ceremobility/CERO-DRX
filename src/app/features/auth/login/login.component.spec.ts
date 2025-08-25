import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../core/services/auth.service';

class MockAuthService {
  login = jasmine.createSpy('login').and.returnValue(of({ token: 't' } as any));
}

describe('LoginComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, LoginComponent],
      providers: [{ provide: AuthService, useClass: MockAuthService }]
    }).compileComponents();
  });

  it('should create and have invalid form initially', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    const comp = fixture.componentInstance;
    expect(comp).toBeTruthy();
    expect(comp.form.invalid).toBeTrue();
  });

  it('should validate and submit when form is valid and terms accepted', async () => {
    const fixture = TestBed.createComponent(LoginComponent);
    const comp = fixture.componentInstance;
    comp.form.setValue({ email: 'a@b.com', password: 'x', accept: true });
    await comp.onSubmit();
    expect(comp.submitting).toBeFalse();
  });

  it('should navigate on token in flat response', async () => {
    const fixture = TestBed.createComponent(LoginComponent);
    const auth = TestBed.inject(AuthService) as any as MockAuthService;
    auth.login.and.returnValue(of({ token: 'abc' }));
    const comp = fixture.componentInstance;
    comp.form.setValue({ email: 'a@b.com', password: 'x', accept: true });
    await comp.onSubmit();
    expect(comp.loginError).toBe('');
  });

  it('should handle server error messages on failure', async () => {
    const fixture = TestBed.createComponent(LoginComponent);
    const auth = TestBed.inject(AuthService) as any as MockAuthService;
    auth.login.and.returnValue(throwError(() => ({ status: 400, error: { message: 'Invalid credentials' } })));
    const comp = fixture.componentInstance;
    comp.form.setValue({ email: 'a@b.com', password: 'bad', accept: true });
    await comp.onSubmit();
    expect(comp.loginError).toContain('Invalid credentials');
    expect(comp.submitting).toBeFalse();
  });
});
