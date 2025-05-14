import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AlertComponent } from './alert.component';
import { AlertService } from '@app/_services';
import { Alert, AlertType } from '@app/_models';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Subject } from 'rxjs';

describe('AlertComponent', () => {
    let component: AlertComponent;
    let fixture: ComponentFixture<AlertComponent>;
    let alertService: jasmine.SpyObj<AlertService>;
    let alertSubject: Subject<Alert>;
    let routerEventsSubject: Subject<any>;
    let router: any;

    beforeEach(() => {
        alertSubject = new Subject<Alert>();
        routerEventsSubject = new Subject<any>();

        alertService = jasmine.createSpyObj('AlertService', ['onAlert', 'clear']);
        alertService.onAlert.and.returnValue(alertSubject.asObservable());

        router = {
            events: routerEventsSubject.asObservable(),
            NavigationStart
        };

        TestBed.configureTestingModule({
            declarations: [AlertComponent],
            providers: [
                { provide: AlertService, useValue: alertService },
                { provide: Router, useValue: router }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        });

        fixture = TestBed.createComponent(AlertComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should display an alert when received from service', () => {
        // Emit an alert
        alertSubject.next({ id: 'default-alert', message: 'Test alert', type: AlertType.Success });
        fixture.detectChanges();

        // Check if alert is displayed
        const alertElement = fixture.debugElement.query(By.css('.alert'));
        expect(alertElement).toBeTruthy();
        expect(alertElement.nativeElement.textContent).toContain('Test alert');
    });

    it('should apply correct CSS class based on alert type', () => {
        // Emit a success alert
        alertSubject.next({ id: 'default-alert', message: 'Success alert', type: AlertType.Success });
        fixture.detectChanges();

        // Check CSS class
        const alertElement = fixture.debugElement.query(By.css('.alert'));
        expect(alertElement.nativeElement.classList).toContain('alert-success');
    });

    it('should remove alert when close button is clicked', fakeAsync(() => {
        // Add an alert
        alertSubject.next({ id: 'default-alert', message: 'Test alert', type: AlertType.Info });
        fixture.detectChanges();

        // Verify alert exists
        let alertElement = fixture.debugElement.query(By.css('.alert'));
        expect(alertElement).toBeTruthy();

        // Click close button
        const closeButton = alertElement.query(By.css('.btn-close'));
        closeButton.triggerEventHandler('click', null);

        // Wait for timeout (for fade effect)
        tick(250);
        fixture.detectChanges();

        // Verify alert is removed
        alertElement = fixture.debugElement.query(By.css('.alert'));
        expect(alertElement).toBeFalsy();
    }));

    it('should automatically close alert when autoClose is true', fakeAsync(() => {
        // Add an alert with autoClose
        alertSubject.next({
            id: 'default-alert',
            message: 'Auto close alert',
            type: AlertType.Warning,
            autoClose: true
        });
        fixture.detectChanges();

        // Verify alert exists
        let alertElement = fixture.debugElement.query(By.css('.alert'));
        expect(alertElement).toBeTruthy();

        // Wait for auto close timeout (3000ms)
        tick(4000);
        fixture.detectChanges();

        // Verify alert is removed
        alertElement = fixture.debugElement.query(By.css('.alert'));
        expect(alertElement).toBeFalsy();
    }));

    it('should clear alerts on navigation', () => {
        // Trigger navigation event
        routerEventsSubject.next(new NavigationStart(1, '/'));

        // Verify clear was called
        expect(alertService.clear).toHaveBeenCalled();
    });

    it('should handle multiple alerts', () => {
        // Add multiple alerts
        alertSubject.next({ id: 'default-alert', message: 'First alert', type: AlertType.Success });
        alertSubject.next({ id: 'default-alert', message: 'Second alert', type: AlertType.Error });
        fixture.detectChanges();

        // Verify both alerts are displayed
        const alertElements = fixture.debugElement.queryAll(By.css('.alert'));
        expect(alertElements.length).toBe(2);
    });

    it('should unsubscribe from subscriptions on destroy', () => {
        // Spy on subscription unsubscribe methods
        spyOn(component.alertSubscription, 'unsubscribe');
        spyOn(component.routeSubscription, 'unsubscribe');

        // Trigger ngOnDestroy
        component.ngOnDestroy();

        // Verify unsubscribe was called
        expect(component.alertSubscription.unsubscribe).toHaveBeenCalled();
        expect(component.routeSubscription.unsubscribe).toHaveBeenCalled();
    });
});
