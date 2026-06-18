import { jest } from '@jest/globals';

let capturedFormatFn = null;
let capturedPrintfFn = null;

jest.unstable_mockModule('winston', () => ({
  default: {
    format: Object.assign(
      jest.fn((fn) => {
        if (!capturedFormatFn) capturedFormatFn = fn;
        return jest.fn();
      }),
      {
        combine: jest.fn(() => 'combine'),
        timestamp: jest.fn(),
        errors: jest.fn(),
        json: jest.fn(),
        colorize: jest.fn(),
        printf: jest.fn((fn) => {
          capturedPrintfFn = fn;
          return 'printf';
        }),
        splat: jest.fn(),
      }
    ),
    transports: {
      Console: jest.fn(),
    },
    createLogger: jest.fn(() => ({ info: jest.fn(), error: jest.fn() })),
  },
}));

jest.unstable_mockModule('winston-daily-rotate-file', () => ({
  default: jest.fn(),
}));

describe('Winston Config', () => {
  const originalEnv = process.env;
  let winston;
  let DailyRotateFile;

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetModules();
    process.env = { ...originalEnv };

    winston = (await import('winston')).default;
    DailyRotateFile = (await import('winston-daily-rotate-file')).default;
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should initialize logger for test environment', async () => {
    process.env.NODE_ENV = 'test';

    const config = await import('../../src/config/winston-config.js');

    expect(winston.transports.Console).toHaveBeenCalledWith(
      expect.objectContaining({ silent: true })
    );
    expect(DailyRotateFile).not.toHaveBeenCalled();
    expect(winston.createLogger).toHaveBeenCalled();
  });

  it('should initialize logger for production environment', async () => {
    process.env.NODE_ENV = 'production';
    process.env.LOG_DIR = 'custom_logs';

    const config = await import('../../src/config/winston-config.js');

    expect(winston.transports.Console).toHaveBeenCalledWith(
      expect.objectContaining({ silent: false })
    );
    // Should have added DailyRotateFile transports for combined and security logs
    expect(DailyRotateFile).toHaveBeenCalledTimes(2);
    expect(DailyRotateFile.mock.calls[0][0].dirname).toBe('custom_logs');

    expect(winston.createLogger).toHaveBeenCalledWith(expect.objectContaining({ level: 'info' }));
  });

  it('should initialize logger for development environment', async () => {
    process.env.NODE_ENV = 'development';
    delete process.env.LOG_DIR; // Ensure default branch is hit

    const config = await import('../../src/config/winston-config.js');

    expect(winston.transports.Console).toHaveBeenCalledWith(
      expect.objectContaining({ silent: false })
    );
    expect(DailyRotateFile).toHaveBeenCalledTimes(2);
    expect(winston.createLogger).toHaveBeenCalledWith(expect.objectContaining({ level: 'debug' }));
  });

  it('should filter security logs correctly via format function', async () => {
    await import('../../src/config/winston-config.js');
    expect(capturedFormatFn).toBeDefined();

    // Valid security message
    const validSecurityInfo = { message: 'security.alert.user_login_failed' };
    expect(capturedFormatFn(validSecurityInfo)).toBe(validSecurityInfo);

    // Invalid security message
    const invalidSecurityInfo = { message: 'app.info.user_logged_in' };
    expect(capturedFormatFn(invalidSecurityInfo)).toBe(false);

    // Non-string message
    const nonStringInfo = { message: { test: 'object' } };
    expect(capturedFormatFn(nonStringInfo)).toBe(false);
  });

  it('should format console output correctly via printf function', async () => {
    await import('../../src/config/winston-config.js');
    expect(capturedPrintfFn).toBeDefined();

    // With stack
    const withStack = {
      timestamp: '2023-01-01',
      level: 'error',
      message: 'Something went wrong',
      stack: 'Error: Something went wrong at line 1',
    };
    expect(capturedPrintfFn(withStack)).toBe(
      '2023-01-01 error: Error: Something went wrong at line 1'
    );

    // Without stack
    const withoutStack = { timestamp: '2023-01-01', level: 'info', message: 'User logged in' };
    expect(capturedPrintfFn(withoutStack)).toBe('2023-01-01 info: User logged in');
  });
});
