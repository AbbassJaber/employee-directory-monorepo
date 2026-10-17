import winston from 'winston';
import { ENV } from './constants';

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        }),
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),
    defaultMeta: { service: 'employee-directory-api' },
    transports: [
        new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error',
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        }),
        new winston.transports.File({
            filename: 'logs/combined.log',
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        }),
    ],
});

// Log to the console as well: readable in development, JSON in production
logger.add(
    new winston.transports.Console(
        process.env['NODE_ENV'] === ENV.PROD
            ? {}
            : {
                  format: winston.format.combine(
                      winston.format.colorize(),
                      winston.format.simple()
                  ),
              }
    )
);

export default logger;
