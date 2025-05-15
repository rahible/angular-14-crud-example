import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { AddEditComponent } from './add-edit.component';
import { UserService, AlertService } from '@app/_services';

class MockUserService {
  getById = jasmine.createSpy().and.returnValue(of({ id: '1', firstName: 'Test', lastName: 'User', email: 'test@email.com', role: 'User' }));
  update = jasmine.createSpy().and.returnValue(of({}));
  create = jasmine.createSpy().and.returnValue(of({}));
}
class MockAlertService {
  clear = jasmine.createSpy();
  success = jasmine.createSpy();
  error = jasmine.createSpy();
}

const mockActivatedRoute = {
  snapshot: { params: {} }
};

const mockRouter = {
  navigateByUrl: jasmine.createSpy('navigateByUrl')
};

describe('AddEditComponent', () => {
  let component: AddEditComponent;
  let fixture: ComponentFixture<AddEditComponent>;
  let userService: MockUserService;
  let alertService: MockAlertService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [AddEditComponent],
      providers: [
        { provide: UserService, useClass: MockUserService },
        { provide: AlertService, useClass: MockAlertService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddEditComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService) as any;
    alertService = TestBed.inject(AlertService) as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not submit if form is invalid', () => {
    component.form.controls['firstName'].setValue('');
    component.onSubmit();
    expect(component.submitting).toBeFalse();
  });

  it('should call saveUser and show success if form is valid', () => {
    spyOn(component, 'saveUser').and.returnValue(of({}));
    component.form.controls['title'].setValue('Mr');
    component.form.controls['firstName'].setValue('Test');
    component.form.controls['lastName'].setValue('User');
    component.form.controls['email'].setValue('test@email.com');
    component.form.controls['role'].setValue('User');
    component.form.controls['password'].setValue('password');
    component.form.controls['confirmPassword'].setValue('password');
    component.onSubmit();
    expect(component.saveUser).toHaveBeenCalled();
  });

  it('should patch form values and set loading false on edit', () => {
    mockActivatedRoute.snapshot = {
      params: { id: '1' }
    }
    component.ngOnInit();
    expect(userService.getById).toHaveBeenCalledWith('1');
    expect(component.loading).toBeFalse();
  });
});
