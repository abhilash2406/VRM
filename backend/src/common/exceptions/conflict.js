export default class Conflict extends Error {
  /** Optional structured payload surfaced to the client by the error handler. */

  constructor(message = 'Conflict', code = 'CONFLICT', statusCode = 409, details) {
    super(message);
    this.name = 'Conflict';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;

    // Maintain proper stack trace (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
