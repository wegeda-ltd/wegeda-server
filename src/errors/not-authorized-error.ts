import { CustomError } from ".";

export class NotAuthorizedError extends CustomError {
    statusCode = 401;

    message = "Not authorized";
    constructor(message?: string) {
        super('Not authorized');


        if (message) {
            this.message = message
        }
        Object.setPrototypeOf(this, NotAuthorizedError.prototype)


    }

    serializeErrors() {
        return [
            { message: this.message }
        ]
    }
}