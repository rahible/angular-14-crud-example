import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListComponent } from './list.component';
import { UserService } from '@app/_services';
import { of } from 'rxjs';

describe('ListComponent', () => {
    let component: ListComponent;
    let fixture: ComponentFixture<ListComponent>;
    let userServiceMock: any;

    beforeEach(async () => {
        userServiceMock = jasmine.createSpyObj('UserService', ['getAll', 'delete']);

        await TestBed.configureTestingModule({
            declarations: [ListComponent],
            providers: [{ provide: UserService, useValue: userServiceMock }]
        }).compileComponents();

        fixture = TestBed.createComponent(ListComponent);
        component = fixture.componentInstance;
    });

    it('should load users on init', () => {
        const mockUsers = [{ id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com', role: 'User' }];
        userServiceMock.getAll.and.returnValue(of(mockUsers));

        component.ngOnInit();

        expect(component.users).toEqual(mockUsers);
    });

    it('should delete user', () => {
        const mockUsers = [{ id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com', role: 'User', isDeleting: false }];
        component.users = mockUsers;
        userServiceMock.delete.and.returnValue(of({}));

        component.deleteUser('1');

        expect(component.users.length).toBe(0);
    });
});
