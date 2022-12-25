import AppError from '.';

export class NotFoundError extends AppError {
  constructor() {
    super(404, 'Route not found');
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}
