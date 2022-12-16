// https://bobbyhadz.com/blog/typescript-property-status-does-not-exist-on-type-error
// https://javascript.plainenglish.io/custom-error-handler-using-nodejs-typescript-2ab744aa4ef7

// export abstract class CustomError extends Error {
//   abstract statusCode: number;
//   constructor(message: string) {
//     super(message);
//     /// capturing the stack trace keeps the reference to your error class
//     // Error.captureStackTrace(this, this.constructor);
//     Object.setPrototypeOf(this, CustomError.prototype);
//   }
//   abstract serializeErrors(): {
//     message: string;
//     field?: string;
//   }[];
// }

export class AppError extends Error {
  status: number = 400;

  constructor(status: number, message: string) {
    super(message);

    this.status = status;

    // 👇️ because we are extending a built-in class
    Object.setPrototypeOf(this, AppError.prototype);
  }
}
