import bcrypt from 'bcrypt';

/**
 * Hashes a plain-text password using bcrypt.
 * @param {string} raw - The plain-text password.
 * @returns {Promise<string>} The hashed password.
 */
export const hashPassword = async (raw) => {
  return bcrypt.hash(raw, 10);
};

/**
 * Verifies a plain-text password against a stored hash.
 * @param {string} raw - The plain-text password.
 * @param {string} stored - The stored bcrypt hash.
 * @returns {Promise<boolean>} True if the password matches.
 */
export const verifyPassword = async (raw, stored) => {
  if (!stored) return false;
  return bcrypt.compare(raw, stored);
};
