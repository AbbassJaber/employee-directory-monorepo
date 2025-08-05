import { Response } from 'express';
import { AppError } from '@/types';
import logger from './logger';
import { Prisma } from '@prisma/client';

export class CustomError extends Error implements AppError {
    public statusCode: number;
    public isOperational: boolean;

    constructor(
        message: string,
        statusCode: number = 500,
        isOperational: boolean = true
    ) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;

        Error.captureStackTrace(this, this.constructor);
    }
}

export class ValidationError extends CustomError {
    constructor(message: string) {
        super(message, 400);
    }
}

export class ForbiddenError extends CustomError {
    constructor(message: string = 'Forbidden') {
        super(message, 403);
    }
}

export class AuthenticationError extends CustomError {
    constructor(message: string = 'Authentication failed') {
        super(message, 401);
    }
}

export class AuthorizationError extends CustomError {
    constructor(message: string = 'Insufficient permissions') {
        super(message, 403);
    }
}

export class NotFoundError extends CustomError {
    constructor(message: string = 'Resource not found') {
        super(message, 404);
    }
}

export class ConflictError extends CustomError {
    constructor(message: string = 'Resource conflict') {
        super(message, 409);
    }
}

export const handleError = (error: Error, res: Response): void => {
    let statusCode = 500;
    let message = 'Internal server error';

    if (error instanceof CustomError) {
        statusCode = error.statusCode;
        message = error.message;
    } else if (error.name === 'ValidationError') {
        statusCode = 400;
        message = error.message;
    } else if (error.name === 'CastError') {
        statusCode = 400;
        message = 'Invalid ID format';
    } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
        statusCode = 409;
        message = 'Duplicate field value';
    }

    // Log error
    logger.error({
        message: error.message,
        stack: error.stack,
        statusCode,
        url: res.req.url,
        method: res.req.method,
        userAgent: res.req.get('User-Agent'),
        ip: res.req.ip,
    });

    res.status(statusCode).json({
        success: false,
        error: message,
        ...(process.env['NODE_ENV'] === 'development' && {
            stack: error.stack,
        }),
    });
};

export const asyncHandler = (fn: Function) => {
    return (req: any, res: any, next: any) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
