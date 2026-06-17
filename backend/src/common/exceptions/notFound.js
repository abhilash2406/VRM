export default class NotFound extends Error {
  /** Optional structured payload surfaced to the client by the error handler. */

  constructor(message = 'Not Found', code = 'NOT_FOUND', statusCode = 404, details) {
    super(message);
    this.name = 'NotFound';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;

    // Maintain proper stack trace (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
