// ---- ENGINE LOGIC ----

// 1. Role-based routing logic
export function determineLoginRedirect(email: string, adminNodeEmail: string = 'admin@dheroes.com'): string {
  if (!email || email.trim() === '') throw new Error('Email vector requires a valid string.');
  
  if (email.toLowerCase().trim() === adminNodeEmail.toLowerCase().trim()) {
    return '/admin/dashboard';
  }
  return '/user/dashboard';
}

// 2. OTP Mathematical Validation
export function validateOtpFormat(otpPayload: string): boolean {
  // Must be exactly 6 digits
  const cleaned = otpPayload.replace(/\s/g, '');
  if (!/^\d{6}$/.test(cleaned)) {
    throw new Error('OTP Payload must be strictly 6 numeric digits.');
  }
  return true;
}

// 3. Node Registration Integrity
export function validateRegistrationData(password: string, confirm: string): boolean {
  if (password.length < 6) {
    throw new Error('Encryption key must strictly exceed 6 characters for node security.');
  }
  if (password !== confirm) {
    throw new Error('Encryption key checksum mismatch.');
  }
  return true;
}
