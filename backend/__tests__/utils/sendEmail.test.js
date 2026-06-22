import { jest } from '@jest/globals';

jest.unstable_mockModule('ejs', () => ({
  default: {
    renderFile: jest.fn(),
  },
}));

jest.unstable_mockModule('../../src/config/nodemailer-config.js', () => ({
  default: {
    sendMail: jest.fn(),
  },
}));

const ejs = await import('ejs');
const transporter = await import('../../src/config/nodemailer-config.js');
const sendEmails = (await import('../../src/utils/sendEmail.js')).default;
const BadRequest = (await import('../../src/common/exceptions/badRequest.js')).default;

describe('sendEmail Utility', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.APP_URL = 'http://test.com';
    process.env.MAIL_EMAIL = 'no-reply@test.com';
  });

  it('should send a plain text email without EJS rendering', async () => {
    transporter.default.sendMail.mockResolvedValue(true);

    const mailOptions = {
      to: 'user@example.com',
      subject: 'Test Subject',
      text: 'Test Body',
    };

    await sendEmails({ mailOptions });

    expect(ejs.default.renderFile).not.toHaveBeenCalled();
    expect(transporter.default.sendMail).toHaveBeenCalledWith({
      ...mailOptions,
      from: 'no-reply@test.com',
    });
  });

  it('should render EJS template and send HTML email', async () => {
    transporter.default.sendMail.mockResolvedValue(true);
    ejs.default.renderFile.mockResolvedValue('<h1>Mock HTML</h1>');

    const mailOptions = {
      to: 'user@example.com',
      subject: 'Test HTML Subject',
    };

    await sendEmails({
      mailOptions,
      fileName: 'test-template.ejs',
      contentVariables: { name: 'John' },
    });

    expect(ejs.default.renderFile).toHaveBeenCalledWith(
      expect.stringContaining('test-template.ejs'),
      { name: 'John', baseurl: 'http://test.com' }
    );

    expect(transporter.default.sendMail).toHaveBeenCalledWith({
      ...mailOptions,
      from: 'no-reply@test.com',
      html: '<h1>Mock HTML</h1>',
    });
  });

  it('should throw BadRequest exception when sending fails', async () => {
    transporter.default.sendMail.mockRejectedValue(new Error('SMTP Error'));

    const mailOptions = {
      to: 'user@example.com',
      subject: 'Test Subject',
    };

    await expect(sendEmails({ mailOptions })).rejects.toThrow(BadRequest);
    await expect(sendEmails({ mailOptions })).rejects.toThrow('Failed to send email: SMTP Error');
  });

  it('should throw BadRequest exception when rendering fails', async () => {
    ejs.default.renderFile.mockRejectedValue(new Error('Render Error'));

    await expect(
      sendEmails({
        mailOptions: { to: 'test@example.com' },
        fileName: 'broken.ejs',
      })
    ).rejects.toThrow(BadRequest);
  });

  it('should render EJS template with fallback baseurl when APP_URL is not set', async () => {
    delete process.env.APP_URL;
    transporter.default.sendMail.mockResolvedValue(true);
    ejs.default.renderFile.mockResolvedValue('<h1>Mock HTML</h1>');

    const mailOptions = { to: 'user@example.com', subject: 'Test' };
    await sendEmails({ mailOptions, fileName: 'test-template.ejs' });

    expect(ejs.default.renderFile).toHaveBeenCalledWith(
      expect.stringContaining('test-template.ejs'),
      expect.objectContaining({ baseurl: 'http://localhost:3000' })
    );
  });

  it('should throw BadRequest exception with String(err) when sending fails with non-Error object', async () => {
    transporter.default.sendMail.mockRejectedValue('String Error');

    const mailOptions = { to: 'user@example.com', subject: 'Test' };

    await expect(sendEmails({ mailOptions })).rejects.toThrow('Failed to send email: String Error');
  });
});
