export class HttpError extends Error {
    statusCode: number;
    constructor( message: string | undefined, statusCode: number, stack?:unknown) {
        super(message);
        this.stack = JSON.stringify(stack);
        this.statusCode = statusCode;
    }
}

export class NotFoundException extends HttpError {
    constructor(message: string | undefined, stack? : unknown) {
        super(message || 'Not Found', 404, stack);
    }
}

export class InternalServerErrorException extends HttpError {
    constructor(message: string | undefined, stack? : unknown) {
        super(message || 'Internal Server Error', 500, stack);
    }
}

// Error handler middleware
export function errorHandler(err: any, req: any, res:any, next:any) {
    const statusCode = err.statusCode || 500;
    console.error(err.message);
    console.error(err.stack);
    return res.status(statusCode).send(err.message);
}
