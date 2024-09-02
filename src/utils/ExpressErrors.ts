export class ExpressError extends Error {
    statusCode: number;
    message: string;

    constructor(message: string, statusCode: number) {
        super();
        this.message = message;
        this.statusCode = statusCode;
    }
}
