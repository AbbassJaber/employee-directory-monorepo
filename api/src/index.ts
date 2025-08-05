import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { handleError } from '@/utils/errors';
import logger from '@/utils/logger';
import { setupSwagger } from '@/swagger';
import v1Router from '@/routes/v1';

dotenv.config();

const app = express();
const PORT = process.env['PORT'];

// Security middleware
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                scriptSrc: ["'self'"],
                imgSrc: ["'self'", 'data:', 'https:'],
            },
        },
    })
);

// CORS configuration
app.use(
    cors({
        origin: process.env['CORS_ORIGIN'],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    })
);

// Rate limiting
const limiter = rateLimit({
    windowMs: parseInt(process.env['RATE_LIMIT_WINDOW_MS']!),
    max: parseInt(process.env['RATE_LIMIT_MAX_REQUESTS']!),
    message: {
        success: false,
        error: 'Too many requests from this IP, please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parser
app.use(cookieParser());

// Compression middleware
app.use(compression());

// Request logging
app.use((req, _, next) => {
    logger.info(`${req.method} ${req.path} - ${req.ip}`);
    next();
});

// Health check endpoint
app.get('/health', (_, res) => {
    res.status(200).json({
        success: true,
        message: 'Employee Directory API is running',
        timestamp: new Date().toISOString(),
        environment: process.env['NODE_ENV'],
    });
});

// API V1 routes
app.use('/api/v1', v1Router);

// Setup Swagger documentation
setupSwagger(app);

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: `Route ${req.originalUrl} not found`,
    });
});

// Error handling middleware
app.use(
    (
        error: Error,
        _: express.Request,
        res: express.Response,
        __: express.NextFunction
    ) => {
        handleError(error, res);
    }
);

if (require.main === module) {
    app.listen(PORT, () => {
        logger.info(`Server is running on port ${PORT}`);
    });
}

export default app;
