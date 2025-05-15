import { FormControl, FormGroup } from '@angular/forms';
import { MustMatch } from './must-match.validator';

describe('MustMatch Validator', () => {
  it('should set mustMatch error if values do not match', () => {
    const form = new FormGroup({
      password: new FormControl('abc'),
      confirmPassword: new FormControl('xyz')
    });
    const validator = MustMatch('password', 'confirmPassword');
    validator(form);
    expect(form.get('confirmPassword')?.errors).toEqual({ mustMatch: true });
  });

  it('should not set error if values match', () => {
    const form = new FormGroup({
      password: new FormControl('abc'),
      confirmPassword: new FormControl('abc')
    });
    const validator = MustMatch('password', 'confirmPassword');
    validator(form);
    expect(form.get('confirmPassword')?.errors).toBeNull();
  });

  it('should not overwrite unrelated errors', () => {
    const form = new FormGroup({
      password: new FormControl('abc'),
      confirmPassword: new FormControl('xyz')
    });
    form.get('confirmPassword')?.setErrors({ other: true });
    const validator = MustMatch('password', 'confirmPassword');
    validator(form);
    expect(form.get('confirmPassword')?.errors).toEqual({ other: true });
  });

  it('should return null if controls do not exist', () => {
    const form = new FormGroup({});
    const validator = MustMatch('password', 'confirmPassword');
    const result = validator(form);
    expect(result).toBeNull();
  });
});
