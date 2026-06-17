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

export const setAuthCookies = (res, audience, payload) => {
  const names = cookieNamesFor(audience);
  const base = baseCookieOptions();

  res.cookie(names.access, payload.accessToken, { ...base, maxAge: payload.accessTtlMs });
  res.cookie(names.refresh, payload.refreshToken, { ...base, maxAge: payload.refreshTtlMs });
};

export const clearAuthCookies = (res, audience) => {
  const names = cookieNamesFor(audience);
  const base = baseCookieOptions();
  res.clearCookie(names.access, base);
  res.clearCookie(names.refresh, base);
};
