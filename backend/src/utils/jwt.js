import jwt from 'jsonwebtoken';

import TokenAudience from '../common/enum/token-audience-enum.js';

/** User access-token lifetime — 15 minutes, expressed in seconds. */
export const ACCESS_TOKEN_TTL_SECONDS = process.env.ACCESS_TOKEN_TTL_SECONDS
  ? parseInt(process.env.ACCESS_TOKEN_TTL_SECONDS, 10)
  : 15 * 60;

/**
 * Sign a short-lived user access token. The claim shape (`sub`, `type`, `aud`)
 * matches exactly what the `jwt-user` Passport strategy verifies, so the
 * resulting token authenticates protected user routes.
 */
export const signUserAccessToken = ({ userId, role }) =>
  jwt.sign({ type: role }, process.env.JWT_SECRET || 'secret', {
    subject: userId,
    audience: TokenAudience.USER,
    expiresIn: ACCESS_TOKEN_TTL_SECONDS,
  });

/**
 * Sign a short-lived admin access token. The claim shape (`sub`, `type`,
 * `role_id`, `aud`) matches exactly what the `jwt-admin` Passport strategy
 * verifies — signed with the admin secret and the `admin` audience — so the
 * resulting token authenticates protected admin routes.
 */
export const signAdminAccessToken = ({ userId, role, roleId }) =>
  jwt.sign({ type: role, role_id: roleId ?? null }, process.env.JWT_SECRET || 'secret', {
    subject: userId,
    audience: TokenAudience.ADMIN,
    expiresIn: ACCESS_TOKEN_TTL_SECONDS,
  });
