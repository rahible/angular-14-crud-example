import {TestBed} from '@angular/core/testing';
import {AlertService} from './alert.service';
import {Alert, AlertType} from '@app/_models';

describe('AlertService', () => {
    let service: AlertService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(AlertService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should send alert', () => {
        const alert: Alert = { id: '1', type: AlertType.Success, message: 'Test alert' };
        service.alert(alert);

        service.onAlert().subscribe(x => {
            expect(x).toEqual(alert);
        });
    });

    it('should clear alert', () => {
        const alert: Alert = { id: '1', type: AlertType.Success, message: 'Test alert' };
        service.alert(alert);
        service.clear('1');

        service.onAlert().subscribe(x => {
            expect(x.id).toEqual('1');
        });
    });
});
