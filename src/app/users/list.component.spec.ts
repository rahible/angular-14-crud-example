import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ListComponent } from './list.component';
import { UserService } from '@app/_services';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let userService: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    userService = jasmine.createSpyObj('UserService', ['getAll', 'delete']);
    await TestBed.configureTestingModule({
      declarations: [ListComponent],
      providers: [
        { provide: UserService, useValue: userService }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load users on init', () => {
    const users = [{ id: '1', firstName: 'Test' }];
    userService.getAll.and.returnValue(of(users));
    component.ngOnInit();
    expect(component.users).toEqual(users);
  });

  it('should delete user and update users list', () => {
    const users = [
      { id: '1', firstName: 'Test', isDeleting: false },
      { id: '2', firstName: 'User', isDeleting: false }
    ];
    component.users = [...users];
    userService.delete.and.returnValue(of({}));
    component.deleteUser('1');
    expect(component.users?.length).toBe(1);
    expect(component.users?.[0].id).toBe('2');
  });
});
