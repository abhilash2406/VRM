import path from 'node:path';
import { fileURLToPath } from 'node:url';

import ejs from 'ejs';

import BadRequest from '../common/exceptions/badRequest.js';
import transporter from '../config/nodemailer-config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEMPLATES_DIR = path.join(__dirname, '..', 'public', 'templates');

/**
 * Renders an EJS template and sends an email via Nodemailer.
 * @param {Object} params - The email parameters.
 * @param {Object} params.mailOptions - Standard Nodemailer options (to, subject, text, etc.).
 * @param {string} [params.fileName] - Optional EJS template filename in the templates directory.
 * @param {Object} [params.contentVariables] - Optional variables to render within the EJS template.
 * @returns {Promise<Object>} Information about the sent email.
 * @throws {BadRequest} If the email fails to send.
 */
const sendEmails = async ({ mailOptions, fileName, contentVariables = {} }) => {
  try {
    let html;
    if (fileName) {
      const templatePath = path.join(TEMPLATES_DIR, fileName);
      html = await ejs.renderFile(templatePath, {
        ...contentVariables,
        baseurl: process.env.APP_URL || 'http://localhost:3000',
      });
    }

    return await transporter.sendMail({
      ...mailOptions,
      from: process.env.MAIL_EMAIL,
      ...(html ? { html } : {}),
    });
  } catch (err) {
    throw new BadRequest(
      `Failed to send email: ${err instanceof Error ? err.message : String(err)}`
    );
  }
};

export default sendEmails;
