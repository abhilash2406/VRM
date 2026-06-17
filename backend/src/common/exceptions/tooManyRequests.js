export default class TooManyRequests extends Error {
  /** Optional structured payload surfaced to the client by the error handler. */

  constructor(
    message = 'Too Many Requests',
    code = 'TOO_MANY_REQUESTS',
    statusCode = 429,
    details
  ) {
    super(message);
    this.name = 'TooManyRequests';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;

    // Maintain proper stack trace (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
