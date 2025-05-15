import { ErrorInterceptor } from './error.interceptor';
import { AlertService } from '@app/_services';
import { HttpHandler, HttpRequest, HttpEvent } from '@angular/common/http';
import { throwError, of } from 'rxjs';

describe('ErrorInterceptor', () => {
  let interceptor: ErrorInterceptor;
  let alertService: jasmine.SpyObj<AlertService>;
  let next: jasmine.SpyObj<HttpHandler>;

  beforeEach(() => {
    alertService = jasmine.createSpyObj('AlertService', ['error']);
    next = jasmine.createSpyObj('HttpHandler', ['handle']);
    interceptor = new ErrorInterceptor(alertService);
  });

  it('should call alertService.error with error message', (done) => {
    const errorResponse = { error: { message: 'Test error' }, statusText: 'Error' };
    next.handle.and.returnValue(throwError(() => errorResponse));
    spyOn(console, 'error');
    const req = new HttpRequest('GET', '/');

    interceptor.intercept(req, next).subscribe({
      error: (err) => {
        expect(alertService.error).toHaveBeenCalledWith('Test error');
        expect(console.error).toHaveBeenCalledWith(errorResponse);
        expect(err).toBe('Test error');
        done();
      }
    });
  });

  it('should fallback to statusText if no error.message', (done) => {
    const errorResponse = { statusText: 'Generic error' };
    next.handle.and.returnValue(throwError(() => errorResponse));
    spyOn(console, 'error');
    const req = new HttpRequest('GET', '/');

    interceptor.intercept(req, next).subscribe({
      error: (err) => {
        expect(alertService.error).toHaveBeenCalledWith('Generic error');
        expect(console.error).toHaveBeenCalledWith(errorResponse);
        expect(err).toBe('Generic error');
        done();
      }
    });
  });

  it('should pass through successful requests', (done) => {
    const req = new HttpRequest('GET', '/');
    next.handle.and.returnValue(of({} as HttpEvent<any>));

    interceptor.intercept(req, next).subscribe({
      next: (event) => {
        expect(event).toEqual({} as HttpEvent<any>);
        expect(alertService.error).not.toHaveBeenCalled();
        done();
      }
    });
  });
});
