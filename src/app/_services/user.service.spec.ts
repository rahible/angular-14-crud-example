import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '@environments/environment';
import { User } from '@app/_models';

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

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should get all users', () => {
        const dummyUsers: User[] = [
            { id: '1', firstName: 'John' },
            { id: '2', firstName: 'Jane' }
        ];

        service.getAll().subscribe(users => {
            expect(users.length).toBe(2);
            expect(users).toEqual(dummyUsers);
        });

        const req = httpMock.expectOne(`${environment.apiUrl}/users`);
        expect(req.request.method).toBe('GET');
        req.flush(dummyUsers);
    });

    it('should get user by id', () => {
        const dummyUser: User = { id: '1', firstName: 'John' };

        service.getById('1').subscribe(user => {
            expect(user).toEqual(dummyUser);
        });

        const req = httpMock.expectOne(`${environment.apiUrl}/users/1`);
        expect(req.request.method).toBe('GET');
        req.flush(dummyUser);
    });

    it('should create a user', () => {
        const newUser: User = { id: '3', firstName: 'Jake' };

        service.create(newUser).subscribe(user => {
            expect(user).toEqual(newUser);
        });

        const req = httpMock.expectOne(`${environment.apiUrl}/users`);
        expect(req.request.method).toBe('POST');
        req.flush(newUser);
    });

    it('should update a user', () => {
        const updatedUser: User = { id: '1', firstName: 'John Doe' };

        service.update('1', updatedUser).subscribe(user => {
            expect(user).toEqual(updatedUser);
        });

        const req = httpMock.expectOne(`${environment.apiUrl}/users/1`);
        expect(req.request.method).toBe('PUT');
        req.flush(updatedUser);
    });

    it('should delete a user', () => {
        service.delete('1').subscribe(response => {
            expect(response).toBeTruthy();
        });

        const req = httpMock.expectOne(`${environment.apiUrl}/users/1`);
        expect(req.request.method).toBe('DELETE');
        req.flush({});
    });
});
