import {TestBed} from "@angular/core/testing";
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {UserService} from "@app/_services/user.service";
import {Role, User} from "@app/_models";

describe('UserService', () => {
  let httpMock: HttpTestingController;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ UserService ]
    });
    httpMock = TestBed.inject(HttpTestingController);
    userService = TestBed.inject(UserService);
  });

  it('should get all', done => {
    const expectedResult : User[] = [
      new User({id: 'foobar123', title: 'Mr.', firstName: 'John', lastName: 'Doe', role: Role.User, email: 'johndoe@gmail.com'}),
      new User({id: 'barbaz654', title: 'Mrs.', firstName: 'Jane', lastName: 'Zoe', role: Role.User, email: 'janezoe@yahoo.com'})
    ]
    userService.getAll().subscribe(data => {
      expect(data).toEqual(expectedResult);
      done();
    });
    const req = httpMock.expectOne('http://localhost:4000/users');
    expect(req.request.method).toBe('GET');
    req.flush(expectedResult);
  });

  it('should get by id', done => {
    const expectedResult = new User({id: 'foobar123', title: 'Mr.', firstName: 'John', lastName: 'Doe', role: Role.User, email: 'johndoe@gmail.com'});

    userService.getById('foobar123').subscribe(data => {
      expect(data).toEqual(expectedResult);
      done();
    });

    const req = httpMock.expectOne('http://localhost:4000/users/foobar123');
    expect(req.request.method).toBe('GET');
    req.flush(expectedResult);
  });

  it('should create', done => {
    const input = {title: 'Mrs.', firstName: 'Jane', lastName: 'Zoe', role: Role.User, email: 'janezoe@yahoo.com'};
    userService.create(input).subscribe(output => {
      done();
    });

    const req = httpMock.expectOne('http://localhost:4000/users');
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('should update', done => {
    const input = {title: 'Mrs.', firstName: 'Jane', lastName: 'Zoe', role: Role.Admin, email: 'janezoe@yahoo.com'};
    userService.update('barbaz654',input).subscribe(output => {
      done();
    });

    const req = httpMock.expectOne('http://localhost:4000/users/barbaz654');
    expect(req.request.method).toBe('PUT');
    req.flush({});
  });

  it('should delete', done => {
    userService.delete('foobar123').subscribe(output => {
      done();
    });

    const req = httpMock.expectOne('http://localhost:4000/users/foobar123');
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});
