import { jest } from '@jest/globals';

jest.unstable_mockModule('nodemailer', () => ({
  createTransport: jest.fn().mockReturnValue({ isTransporter: true }),
}));

describe('Nodemailer Config', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should initialize createTransport with default settings when env vars are missing', async () => {
    delete process.env.MAIL_HOST;
    delete process.env.MAIL_PORT;

    const nodemailer = await import('nodemailer');
    const transporter = (await import('../../src/config/nodemailer-config.js')).default;

    expect(nodemailer.createTransport).toHaveBeenCalledWith(
      expect.objectContaining({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
      })
    );
    expect(transporter).toEqual({ isTransporter: true });
  });

  it('should initialize createTransport with env variables', async () => {
    process.env.MAIL_HOST = 'smtp.test.com';
    process.env.MAIL_PORT = '465';
    process.env.MAIL_EMAIL = 'test@example.com';
    process.env.MAIL_PASS = 'password123';

    const nodemailer = await import('nodemailer');
    const transporter = (await import('../../src/config/nodemailer-config.js')).default;

    expect(nodemailer.createTransport).toHaveBeenCalledWith(
      expect.objectContaining({
        host: 'smtp.test.com',
        port: '465',
        secure: true,
        auth: {
          user: 'test@example.com',
          pass: 'password123',
        },
      })
    );
  });
});
