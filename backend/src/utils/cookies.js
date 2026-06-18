export const cookieNamesFor = (_audience) => ({
  access: 'access_token',
  refresh: 'refresh_token',
});

const baseCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.COOKIE_SAME_SITE || 'lax',
  domain: process.env.COOKIE_DOMAIN || undefined,
  path: '/',
});

/**
 * Sets HTTP-only authentication cookies on the response.
 * @param {import('express').Response} res - The Express response object.
 * @param {string} audience - The target audience (e.g., 'user', 'admin').
 * @param {Object} payload - The token payload.
 * @param {string} payload.accessToken - The generated access token.
 * @param {string} payload.refreshToken - The generated refresh token.
 * @param {number} payload.accessTtlMs - Max age for access token in milliseconds.
 * @param {number} payload.refreshTtlMs - Max age for refresh token in milliseconds.
 */
export const setAuthCookies = (res, audience, payload) => {
  const names = cookieNamesFor(audience);
  const base = baseCookieOptions();

  res.cookie(names.access, payload.accessToken, { ...base, maxAge: payload.accessTtlMs });
  res.cookie(names.refresh, payload.refreshToken, { ...base, maxAge: payload.refreshTtlMs });
};

/**
 * Clears the authentication cookies.
 * @param {import('express').Response} res - The Express response object.
 * @param {string} audience - The target audience mapping to the cookies.
 */
export const clearAuthCookies = (res, audience) => {
  const names = cookieNamesFor(audience);
  const base = baseCookieOptions();
  res.clearCookie(names.access, base);
  res.clearCookie(names.refresh, base);
};
