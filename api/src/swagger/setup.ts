import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { Express } from 'express';
import { createSwaggerConfig } from './config';

export const setupSwagger = (app: Express) => {
    const swaggerOptions = createSwaggerConfig();
    const swaggerSpec = swaggerJsdoc(swaggerOptions);

    // Swagger documentation middleware
    app.use(
        '/docs',
        swaggerUi.serve,
        swaggerUi.setup(swaggerSpec, {
            customCss: '.swagger-ui .topbar { display: none }',
            customSiteTitle: 'Employee Directory API Documentation',
        })
    );

    return swaggerSpec;
};
