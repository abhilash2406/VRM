import { generateRefreshToken, generateResetToken, sha256 } from '../../src/utils/crypto.js';

describe('Crypto Utility', () => {
  describe('generateRefreshToken', () => {
    it('should generate a 64-character hex string', () => {
      const token = generateRefreshToken();
      expect(typeof token).toBe('string');
      expect(token).toHaveLength(64); // 32 bytes * 2 hex chars/byte
      expect(/^[0-9a-f]+$/i.test(token)).toBe(true);
    });

    it('should generate unique tokens', () => {
      const token1 = generateRefreshToken();
      const token2 = generateRefreshToken();
      expect(token1).not.toBe(token2);
    });
  });

  describe('generateResetToken', () => {
    it('should generate a 64-character hex string', () => {
      const token = generateResetToken();
      expect(typeof token).toBe('string');
      expect(token).toHaveLength(64);
      expect(/^[0-9a-f]+$/i.test(token)).toBe(true);
    });

    it('should generate unique tokens', () => {
      const token1 = generateResetToken();
      const token2 = generateResetToken();
      expect(token1).not.toBe(token2);
    });
  });

  describe('sha256', () => {
    it('should correctly hash a string using sha256', () => {
      const input = 'test-value';
      const hash = sha256(input);
      // Expected SHA256 of 'test-value'
      expect(hash).toBe('5b1406fffc9de5537eb35a845c99521f26fba0e772d58b42e09f4221b9e043ae');
    });

    it('should produce consistent hashes for the same input', () => {
      const hash1 = sha256('input');
      const hash2 = sha256('input');
      expect(hash1).toBe(hash2);
    });

    it('should produce different hashes for different inputs', () => {
      const hash1 = sha256('input1');
      const hash2 = sha256('input2');
      expect(hash1).not.toBe(hash2);
    });
  });
});
