import { z } from "zod";
import { Logger } from "../logger/logger";
import { NextFunction, Request,  Response } from "express";

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
export const validationErrorHandler = (err: any, req: Request, res:Response, next:NextFunction) => {
    if (err instanceof z.ZodError) {
        Logger.error("red", "Errors on validation: ",req.url, err.message);
        res.status(400).send();
    }else if (err instanceof HttpError){
        res.status(err.statusCode).send();
    }
    next()
}
