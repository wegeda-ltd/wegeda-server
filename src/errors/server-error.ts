import { CustomError } from "./custom-error";

export class ServerError extends CustomError {
    statusCode = 500;

    message = "An Error Occurred";

    constructor(message?: string) {
        super("An Error Occurred");

        if (message) {
            this.message = message
        }

        Object.setPrototypeOf(this, ServerError.prototype)


    }

    serializeErrors() {
        return [
            { message: this.message }
        ]
    }
}