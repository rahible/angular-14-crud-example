import {ComponentFixture, fakeAsync, TestBed} from "@angular/core/testing";
import {UserService} from "../_services";
import {Role, User} from "../_models";
import {of} from "rxjs";
import {ListComponent} from "@app/users/list.component";
import {ChangeDetectionStrategy} from "@angular/core";

describe('ListComponent', () => {

  let serviceMock: any;
  let getAllSpy: any;
  let deleteSpy: any;
  let fixture: ComponentFixture<ListComponent>;
  let component: ListComponent;

  const users : User[] = [
    new User({id: 'foobar123', title: 'Mr.', firstName: 'John', lastName: 'Doe', role: Role.User, email: 'johndoe@gmail.com'}),
    new User({id: 'barbaz654', title: 'Mrs.', firstName: 'Jane', lastName: 'Zoe', role: Role.User, email: 'janezoe@yahoo.com'})
  ]

  beforeEach(() => {
    serviceMock = jasmine.createSpyObj('mockUserService', ['getAll','delete']);
    getAllSpy = serviceMock.getAll.and.returnValue(of(users));
    deleteSpy = serviceMock.delete.and.returnValue(of(true));
    TestBed.configureTestingModule({
      providers: [{provide: UserService, useValue: serviceMock}],
      declarations: [ListComponent]
    })
      .overrideComponent(ListComponent, { set: { changeDetection: ChangeDetectionStrategy.Default }});
    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
  });

  it('should list users', fakeAsync(() => {
    const rootElement: HTMLElement = fixture.nativeElement;
    fixture.detectChanges();
    const trs = rootElement.querySelectorAll('tr');

    expect(getAllSpy.calls.all().length).toEqual(1);
    expect(component.users?.length).toEqual(2);
    expect(trs.length).toEqual(3);
  }));

  it('should delete', () => {
    const rootElement: HTMLElement = fixture.nativeElement;
    fixture.detectChanges();
    let trs = rootElement.querySelectorAll('tr');
    expect(trs.length).toEqual(3); // 3 rows originally

    // click the delete button
    const buttons = rootElement.querySelectorAll('button');
    buttons[0].click();
    fixture.detectChanges();

    // expect row deleted
    trs = rootElement.querySelectorAll('tr');
    expect(trs.length).toEqual(2); // only 2 rows now
    expect(deleteSpy.calls.allArgs()).toEqual([['foobar123']]);
  });
});
