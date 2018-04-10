import {AuthTokenInterceptor} from './auth.token.interceptor';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule, HttpHeaders} from '@angular/common/http';
import {async, inject, TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';

describe('AuthTokenInterceptor', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule],
      providers: [{provide: HTTP_INTERCEPTORS, useClass: AuthTokenInterceptor, multi: true}]
    });
  });

  afterEach(inject([HttpTestingController], (backend: HttpTestingController) => {
    backend.verify();
  }));

  it(`should set the jwt into the session store`,
    async(
      inject([HttpClient, HttpTestingController], (http: HttpClient, backend: HttpTestingController) => {

        http.get('/foo/bar', {observe: 'response'})
          .subscribe(resp => {
            const token = sessionStorage.getItem('qb_jwt');
            const authHeader = resp.headers.get('Authorization');

            expect(authHeader).toBe('Bearer 12345');
            expect(token).toBe('Bearer 12345');
            expect(resp.body).toBe('Reply');
          });

        backend.expectOne({
          url: '/foo/bar',
          method: 'GET'
        }).flush('Reply', {headers: new HttpHeaders().set('Authorization', 'Bearer 12345')});
      })
    )
  );

  it(`should add the jwt from the session store to the Authorization header`,
    async(
      inject([HttpClient, HttpTestingController], (http: HttpClient, backend: HttpTestingController) => {

        sessionStorage.setItem('qb_jwt', 'Bearer 67890');

        http.get('/foo/bar', {observe: 'response'})
          .subscribe(resp => {
            const authHeader = resp.headers.get('Authorization');
            const token = sessionStorage.getItem('qb_jwt');

            expect(authHeader).toBeNull();
            expect(token).toBe('Bearer 67890');
            expect(resp.body).toBe('Reply2');
          });

        const request = backend.expectOne({
          url: '/foo/bar',
          method: 'GET'
        });
        expect(request.request.headers.get('Authorization')).toBe('Bearer 67890');
        request.flush('Reply2');
      })
    )
  );

});
