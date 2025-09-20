import { validateEmail, validatePassword } from '../validation';

describe('Validation', () => {
  it('validates email', () => {
    expect(validateEmail('test@example.com')).toBe(true);
    expect(validateEmail('bademail')).toBe(false);
  });
  it('validates password', () => {
    expect(validatePassword('123456')).toBe(true);
    expect(validatePassword('123')).toBe(false);
  });
});
