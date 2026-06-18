import { fileURLToPath } from 'url';
import { dirname } from 'path';
import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'VRM System',
      version: '1.0.0',
      description: 'API documentation for VRM system',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  schemes: ['http', 'https'],
  apis: [
    path.resolve(__dirname, '../api/contactManagement/index.js'),
    path.resolve(__dirname, '../api/authentication/index.js'),
    path.resolve(__dirname, '../api/driverManagement/index.js'),
    path.resolve(__dirname, '../api/vehicleManagement/index.js'),
    path.resolve(__dirname, '../api/tripManagement/index.js'),
    path.resolve(__dirname, '../api/routeManagement/index.js'),
    path.resolve(__dirname, '../api/transactionManagement/index.js'),
    path.resolve(__dirname, '../api/profileManagement/index.js'),
    path.resolve(__dirname, '../api/designationManagement/index.js'),
    path.resolve(__dirname, '../api/permissionManagement/index.js'),
    path.resolve(__dirname, '../api/FileUpload/index.js'),
  ],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export default swaggerSpec;
