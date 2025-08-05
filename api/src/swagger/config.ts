import { ENV } from '@/utils/constants';
import { swaggerSchemas } from './schemas';

export const createSwaggerConfig = () => {
    return {
        definition: {
            openapi: '3.0.0',
            info: {
                title: 'Employee Directory API',
                version: '1.0.0',
                description:
                    'A comprehensive employee directory API with authentication, and permissions',
            },
            servers: [
                {
                    url: `${process.env['NODE_ENV'] === ENV.DEV ? 'http' : 'https'}://${process.env['HOST']}${process.env['NODE_ENV'] === ENV.DEV ? `:${process.env['PORT']}` : ''}`,
                    description: 'Server',
                },
            ],
            components: {
                securitySchemes: {
                    bearerAuth: {
                        type: 'http',
                        scheme: 'bearer',
                        bearerFormat: 'JWT',
                    },
                },
                schemas: swaggerSchemas,
            },
        },
        apis: ['./src/routes/**/*.ts', './src/swagger/docs.ts'],
    };
};
