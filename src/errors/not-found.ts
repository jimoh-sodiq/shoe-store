import { StatusCodes } from "http-status-codes";
import CustomAPIError from "./custom-error.js";

class NotFoundError extends CustomAPIError {
  statusCode: StatusCodes;
  constructor(message: string) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

export default NotFoundError;