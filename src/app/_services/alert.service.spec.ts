import { AlertService } from './alert.service';
import { Alert, AlertType, AlertOptions } from '@app/_models';

describe('AlertService', () => {
  let service: AlertService;

  beforeEach(() => {
    service = new AlertService();
  });

  it('should emit success alert', (done) => {
    service.onAlert().subscribe(alert => {
      expect(alert.message).toBe('success');
      expect(alert.type).toBe(AlertType.Success);
      done();
    });
    service.success('success');
  });

  it('should emit error alert', (done) => {
    service.onAlert().subscribe(alert => {
      expect(alert.message).toBe('error');
      expect(alert.type).toBe(AlertType.Error);
      done();
    });
    service.error('error');
  });

  it('should emit info alert', (done) => {
    service.onAlert().subscribe(alert => {
      expect(alert.message).toBe('info');
      expect(alert.type).toBe(AlertType.Info);
      done();
    });
    service.info('info');
  });

  it('should emit warning alert', (done) => {
    service.onAlert().subscribe(alert => {
      expect(alert.message).toBe('warn');
      expect(alert.type).toBe(AlertType.Warning);
      done();
    });
    service.warn('warn');
  });

  it('should emit alert with custom id', (done) => {
    service.onAlert('custom').subscribe(alert => {
      expect(alert.id).toBe('custom');
      expect(alert.message).toBe('custom alert');
      done();
    });
    service.alert(new Alert({ id: 'custom', message: 'custom alert', type: AlertType.Info }));
  });

  it('should clear alert by id', (done) => {
    service.onAlert('clearId').subscribe(alert => {
      expect(alert.id).toBe('clearId');
      expect(alert.message).toBeUndefined();
      done();
    });
    service.clear('clearId');
  });

  it('should use default id if none provided', (done) => {
    service.onAlert().subscribe(alert => {
      expect(alert.id).toBe('default-alert');
      done();
    });
    service.alert(new Alert({ message: 'default', type: AlertType.Info }));
  });
});
