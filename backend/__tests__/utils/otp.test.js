import { generateOtp, verifyOtp } from '../../src/utils/otp.js';

describe('OTP Utility', () => {
  describe('generateOtp', () => {
    it('should generate a 6-digit numeric string', () => {
      const otp = generateOtp();
      expect(typeof otp).toBe('string');
      expect(otp).toHaveLength(6);
      expect(/^[0-9]{6}$/.test(otp)).toBe(true);
    });

    it('should generate numeric values between 100000 and 999999', () => {
      for (let i = 0; i < 100; i++) {
        const otp = generateOtp();
        const num = parseInt(otp, 10);
        expect(num).toBeGreaterThanOrEqual(100000);
        expect(num).toBeLessThanOrEqual(999999);
      }
    });
  });

  describe('verifyOtp', () => {
    it('should return true for matching OTPs', () => {
      expect(verifyOtp('123456', '123456')).toBe(true);
    });

    it('should return false for non-matching OTPs', () => {
      expect(verifyOtp('123456', '654321')).toBe(false);
    });

    it('should return false for OTPs of different lengths', () => {
      expect(verifyOtp('12345', '123456')).toBe(false);
    });

    it('should handle empty string inputs gracefully', () => {
      expect(verifyOtp('', '')).toBe(true);
      expect(verifyOtp('', '123456')).toBe(false);
    });
  });
});
