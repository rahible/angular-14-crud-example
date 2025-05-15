import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router, NavigationStart } from '@angular/router';
import { of, Subject } from 'rxjs';
import { AlertComponent } from './alert.component';
import { AlertService } from '@app/_services';
import { Alert, AlertType } from '@app/_models';
import { Component } from '@angular/core';

class MockRouter {
  public events = new Subject<any>();
}

class MockAlertService {
  private alertSubject = new Subject<Alert>();
  onAlert() { return this.alertSubject.asObservable(); }
  clear = jasmine.createSpy('clear');
  send(alert: Alert) { this.alertSubject.next(alert); }
  close() { this.alertSubject.complete(); }
}

describe('AlertComponent', () => {
  let component: AlertComponent;
  let fixture: ComponentFixture<AlertComponent>;
  let mockRouter: MockRouter;
  let mockAlertService: MockAlertService;

  beforeEach(async () => {
    mockRouter = new MockRouter();
    mockAlertService = new MockAlertService();

    await TestBed.configureTestingModule({
      declarations: [AlertComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: AlertService, useValue: mockAlertService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    mockAlertService.close();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to alerts and add alert', () => {
    const alert: Alert = { message: 'test', type: AlertType.Success } as Alert;
    mockAlertService.send(alert);
    expect(component.alerts.length).toBe(1);
    expect(component.alerts[0].message).toBe('test');
  });

  it('should remove alert after autoClose', fakeAsync(() => {
    const alert: Alert = { message: 'auto close', type: AlertType.Info, autoClose: true } as Alert;
    mockAlertService.send(alert);
    expect(component.alerts.length).toBe(1);
    tick(3000);
    // simulate setTimeout in removeAlert
    tick(250);
    expect(component.alerts.length).toBe(0);
  }));

  it('should clear alerts on route change', () => {
    mockRouter.events.next(new NavigationStart(1, '/'));
    expect(mockAlertService.clear).toHaveBeenCalledWith('default-alert');
  });

  it('should remove alert when removeAlert is called', fakeAsync(() => {
    const alert: Alert = { message: 'remove', type: AlertType.Warning } as Alert;
    component.alerts = [alert];
    component.removeAlert(alert);
    tick(250);
    expect(component.alerts.length).toBe(0);
  }));

  it('should return correct css class', () => {
    const alert: Alert = { type: AlertType.Success, fade: true } as Alert;
    const result = component.cssClass(alert);
    expect(result).toContain('alert-success');
    expect(result).toContain('fade');
  });

  it('should unsubscribe on destroy', () => {
    spyOn(component.alertSubscription, 'unsubscribe');
    spyOn(component.routeSubscription, 'unsubscribe');
    component.ngOnDestroy();
    expect(component.alertSubscription.unsubscribe).toHaveBeenCalled();
    expect(component.routeSubscription.unsubscribe).toHaveBeenCalled();
  });
});
