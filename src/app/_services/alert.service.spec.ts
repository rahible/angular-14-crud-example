import {TestBed} from "@angular/core/testing";
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {AlertService} from "../_services/alert.service";
import {Alert, AlertType, Role, User} from "../_models";

describe('AlertService', () => {
  let httpMock: HttpTestingController;
  let alertService: AlertService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ AlertService ]
    });
    httpMock = TestBed.inject(HttpTestingController);
    alertService = TestBed.inject(AlertService);
  });

  it('should allow subscribe to onAlert', () => {
    const results: Alert[] = [];
    const sub = alertService.onAlert().subscribe(alert => {
      results.push(alert);
    });
    alertService.success('the success', {});
    alertService.error('the failure', {});

    expect(results[0].type).toEqual(AlertType.Success);
    expect(results[0].message).toEqual('the success');
    expect(results[1].type).toEqual(AlertType.Error);
    expect(results[1].message).toEqual('the failure');
    sub.unsubscribe();
  });

  it('should add info messages', () => {
    const results: Alert[] = [];
    const sub = alertService.onAlert().subscribe(alert => {
      results.push(alert);
    });
    alertService.info('message', {});

    expect(results[0].type).toEqual(AlertType.Info);
    sub.unsubscribe();
  });

  it('should add warn messages', () => {
    const results: Alert[] = [];
    const sub = alertService.onAlert().subscribe(alert => {
      results.push(alert);
    });

    alertService.warn('message', {});

    expect(results[0].type).toEqual(AlertType.Warning);
    sub.unsubscribe();
  });

  it('should only subscribe to the correct id', () => {
    const primaryAlerts: Alert[] = [];
    const primarySub = alertService.onAlert('primary-id').subscribe(alert => {
      primaryAlerts.push(alert);
    });

    const secondaryAlerts: Alert[] = [];
    const secondarySub = alertService.onAlert('secondary-id').subscribe(alert => {
      secondaryAlerts.push(alert);
    });

    alertService.warn('message 1', {id: 'primary-id'});
    alertService.info('message 2', {id: 'secondary-id'});
    alertService.success('message 3');
    alertService.info('message 4', {id: 'secondary-id'});

    expect(primaryAlerts.length).toEqual(1);
    expect(secondaryAlerts.length).toEqual(2);
    primarySub.unsubscribe();
    secondarySub.unsubscribe();
  });

  it('should clear', done => {
    const results: Alert[] = [];
    const sub = alertService.onAlert().subscribe(alert => {
      expect(alert.id).toEqual('default-alert');
      expect(alert.message).toBeFalsy();
      done();
    });

    alertService.clear();
  });
});
