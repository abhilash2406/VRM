import crypto from 'node:crypto';

/**
 * Generate a 256-bit opaque refresh token, hex-encoded. The raw value is sent
 * to the client (httpOnly cookie) and never persisted — only its SHA-256
 * hash is stored server-side.
 */
export const generateRefreshToken = () => crypto.randomBytes(32).toString('hex');

/**
 * Generate a 256-bit opaque password-reset token, hex-encoded. Like the
 * refresh token, the raw value goes only to the user (reset-link query param)
 * and is never persisted — Redis holds just its SHA-256 hash.
 */
export const generateResetToken = () => crypto.randomBytes(32).toString('hex');

/**
 * SHA-256 hash of a value, hex-encoded. Used to derive the Redis key suffix
 * for refresh tokens so a Redis dump never exposes a usable token.
 */
export const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');
