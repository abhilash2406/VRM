export default class Unauthorized extends Error {
  /** Optional structured payload surfaced to the client by the error handler. */

  constructor(message = 'Unauthorized', code = 'UNAUTHORIZED', statusCode = 401, details) {
    super(message);
    this.name = 'Unauthorized';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
