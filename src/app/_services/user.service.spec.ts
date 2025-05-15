import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { environment } from '@environments/environment';
import { User } from '@app/_models';

const baseUrl = `${environment.apiUrl}/users`;

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should retrieve all users', () => {
    const mockUsers: User[] = [{ id: "1", email: 'a@b.com' } as User];
    service.getAll().subscribe(users => {
      expect(users.length).toBe(1);
      expect(users).toEqual(mockUsers);
    });
    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });

  it('should retrieve user by id', () => {
    const mockUser: User = { id: "2", email: 'c@d.com' } as User;
    service.getById('2').subscribe(user => {
      expect(user).toEqual(mockUser);
    });
    const req = httpMock.expectOne(`${baseUrl}/2`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  it('should create a user', () => {
    const params = { email: 'e@f.com' };
    service.create(params).subscribe(resp => {
      expect(resp).toEqual(params);
    });
    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    req.flush(params);
  });

  it('should update a user', () => {
    const params = { email: 'g@h.com' };
    service.update('3', params).subscribe(resp => {
      expect(resp).toEqual(params);
    });
    const req = httpMock.expectOne(`${baseUrl}/3`);
    expect(req.request.method).toBe('PUT');
    req.flush(params);
  });

  it('should delete a user', () => {
    service.delete('4').subscribe(resp => {
      expect(resp).toBeNull();
    });
    const req = httpMock.expectOne(`${baseUrl}/4`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
