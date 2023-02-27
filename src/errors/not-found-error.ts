import { CustomError } from ".";

export class NotFoundError extends CustomError {
    statusCode = 404;
    message = "Resource not found"

    constructor(message?: string) {
        super('Resource not found');

        if (message) {
            this.message = message
        }

        Object.setPrototypeOf(this, NotFoundError.prototype)


    }

    serializeErrors() {
        return [
            { message: this.message }
        ]
    }

}
