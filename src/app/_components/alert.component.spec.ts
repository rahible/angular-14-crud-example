import {ComponentFixture, fakeAsync, TestBed, tick} from "@angular/core/testing";
import {of} from "rxjs";
import {ChangeDetectionStrategy} from "@angular/core";
import {AlertComponent} from "@app/_components/alert.component";
import {AlertService} from "@app/_services";

describe('ListComponent', () => {

  let serviceMock: any;
  let onAlertSpy: any;
  let deleteSpy: any;
  let fixture: ComponentFixture<AlertComponent>;
  let component: AlertComponent;
  let alertService: AlertService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AlertService],
      declarations: [AlertComponent]
    })
      .overrideComponent(AlertComponent, { set: { changeDetection: ChangeDetectionStrategy.Default }});
    fixture = TestBed.createComponent(AlertComponent);
    component = fixture.componentInstance;
    alertService = TestBed.inject(AlertService);
  });

  it('should create', fakeAsync(() => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  }));

  it('should subscribe to alerts', () => {
    let spy = spyOn(alertService, 'onAlert');
    spy.and.callThrough();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
  });


  it('should show alerts', () => {
    const rootElement: HTMLElement = fixture.nativeElement;
    fixture.detectChanges();

    alertService.success('success message');
    fixture.detectChanges();

    let messages = rootElement.querySelectorAll('span');
    expect(messages.length).toEqual(1);
    expect(messages[0].innerText).toEqual('success message');
  });

  it('should remove alert', fakeAsync(() => {
    const rootElement: HTMLElement = fixture.nativeElement;
    fixture.detectChanges();

    alertService.success('success message');
    fixture.detectChanges();

    let messages = rootElement.querySelectorAll('span');
    expect(messages.length).toEqual(1);

    rootElement.querySelector('button')?.click();
    tick(300);
    fixture.detectChanges();

    messages = rootElement.querySelectorAll('span');
    expect(messages.length).toEqual(0);
  }));

  it('should auto-remove an alert', fakeAsync(()=>{
    const rootElement: HTMLElement = fixture.nativeElement;
    fixture.detectChanges();

    alertService.success('success message', {autoClose: true});
    fixture.detectChanges();

    let messages = rootElement.querySelectorAll('span');
    expect(messages.length).toEqual(1);

    tick(4000);
    fixture.detectChanges();

    messages = rootElement.querySelectorAll('span');
    expect(messages.length).toEqual(0);
  }));
});
