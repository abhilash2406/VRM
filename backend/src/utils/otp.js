import crypto from 'node:crypto';

/**
 * Generate a cryptographically-random 6-digit numeric OTP.
 * `randomInt` is max-exclusive, so the upper bound is 1_000_000 to keep the
 * full `100000`–`999999` range in play.
 */
export const generateOtp = () => String(crypto.randomInt(100000, 1000000));

/**
 * Constant-time comparison of a user-supplied OTP against the expected value.
 * `crypto.timingSafeEqual` throws on buffers of unequal length, so the length
 * check is done first and a mismatch short-circuits to `false`.
 */
export const verifyOtp = (provided, expected) => {
  const providedBuffer = Buffer.from(provided);
  const expectedBuffer = Buffer.from(expected);

  if (providedBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(providedBuffer, expectedBuffer);
};
