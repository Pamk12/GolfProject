import test from 'node:test';
import assert from 'node:assert';
import { determineLoginRedirect, validateOtpFormat, validateRegistrationData } from './authLogic';

test('determineLoginRedirect routes identical matches to /admin', () => {
  const adminEmail = 'ROOT@DHEROES.com';
  const result = determineLoginRedirect('root@dheroes.com  ', adminEmail);
  assert.strictEqual(result, '/admin/dashboard');
});

test('determineLoginRedirect routes standard nodes to /user', () => {
  const result = determineLoginRedirect('user123@gmail.com');
  assert.strictEqual(result, '/user/dashboard');
});

test('determineLoginRedirect safely rejects empty vectors', () => {
  assert.throws(() => determineLoginRedirect('   '), /valid string/);
});

test('validateOtpFormat verifies exact 6 digit strings', () => {
  assert.strictEqual(validateOtpFormat('123456'), true);
  assert.strictEqual(validateOtpFormat(' 123 456 '), true); 
});

test('validateOtpFormat mathematically rejects invalid vectors', () => {
  assert.throws(() => validateOtpFormat('12345'), /strictly 6 numeric/);
  assert.throws(() => validateOtpFormat('1234567'), /strictly 6 numeric/);
  assert.throws(() => validateOtpFormat('abcdef'), /strictly 6 numeric/);
});

test('validateRegistrationData secures the entropy minimums', () => {
  assert.strictEqual(validateRegistrationData('secureHashed123', 'secureHashed123'), true);
});

test('validateRegistrationData blocks checksum breaches', () => {
  assert.throws(() => validateRegistrationData('secure123', 'secure456'), /checksum mismatch/);
});

test('validateRegistrationData blocks weak entropy', () => {
  assert.throws(() => validateRegistrationData('12345', '12345'), /strictly exceed 6/);
});
