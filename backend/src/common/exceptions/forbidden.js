export default class Forbidden extends Error {
  /** Optional structured payload surfaced to the client by the error handler. */

  constructor(message = 'Forbidden', code = 'FORBIDDEN', statusCode = 403, details) {
    super(message);
    this.name = 'Forbidden';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
