import { jest } from '@jest/globals';
import bcrypt from 'bcrypt';
import { hashPassword, verifyPassword } from '../../src/utils/password.js';

describe('Password Utility', () => {
  describe('hashPassword', () => {
    it('should hash a password using bcrypt', async () => {
      const rawPassword = 'mysecretpassword';
      const hashedPassword = await hashPassword(rawPassword);

      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).not.toBe(rawPassword);

      // Verify the generated hash is valid
      const isValid = await bcrypt.compare(rawPassword, hashedPassword);
      expect(isValid).toBe(true);
    });
  });

  describe('verifyPassword', () => {
    it('should return true for a correct password', async () => {
      const rawPassword = 'mysecretpassword';
      const storedHash = await bcrypt.hash(rawPassword, 10);

      const isValid = await verifyPassword(rawPassword, storedHash);
      expect(isValid).toBe(true);
    });

    it('should return false for an incorrect password', async () => {
      const rawPassword = 'mysecretpassword';
      const storedHash = await bcrypt.hash('differentpassword', 10);

      const isValid = await verifyPassword(rawPassword, storedHash);
      expect(isValid).toBe(false);
    });

    it('should return false if stored password is null or undefined', async () => {
      const isValidNull = await verifyPassword('password', null);
      expect(isValidNull).toBe(false);

      const isValidUndefined = await verifyPassword('password', undefined);
      expect(isValidUndefined).toBe(false);
    });
  });
});
