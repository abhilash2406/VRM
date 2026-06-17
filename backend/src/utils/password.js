import bcrypt from 'bcrypt';

export const hashPassword = async (raw) => {
  return bcrypt.hash(raw, 10);
};

export const verifyPassword = async (raw, stored) => {
  if (!stored) return false;
  return bcrypt.compare(raw, stored);
};
