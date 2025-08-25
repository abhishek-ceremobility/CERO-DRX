import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';
import { environment } from '../../../environments/environment';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('prefixes requests with environment.apiUrl', () => {
    service.getData('items').subscribe();
    const base = environment.apiUrl.endsWith('/') ? environment.apiUrl.slice(0, -1) : environment.apiUrl;
    const req = httpMock.expectOne(`${base}/items`);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('does not set Authorization header itself', () => {
    service.getData('items').subscribe();
    const base = environment.apiUrl.endsWith('/') ? environment.apiUrl.slice(0, -1) : environment.apiUrl;
    const req = httpMock.expectOne(`${base}/items`);
    expect(req.request.headers.has('Authorization')).toBeFalse();
    req.flush([]);
  });
});
