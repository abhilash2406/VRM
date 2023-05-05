const swaggerJsdoc = require('swagger-jsdoc');
const fs = require('fs');
const path = require('path');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'truck ',
      version: '1.0.1',
      description: 'My API description',
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
    path.resolve(`${__dirname}/../../../api/contactManagement/index.js`),
  
  ],
};



const swaggerSpec = swaggerJsdoc(swaggerOptions);

module.exports = swaggerSpec;