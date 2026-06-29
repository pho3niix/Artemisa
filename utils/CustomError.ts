export default class CustomError extends Error {

  statusCode: number;
  message: string;
  errors?: any[];
  name: string;

  constructor(
    statusCode: number,
    message: string,
    errors?: any[]
  ) {

    super(message);

    this.statusCode = statusCode;
    this.message = message;
    this.errors = errors;

    this.name = "CustomError";
  }
}