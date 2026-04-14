// 4.1 Instal·lació de dependències: (Veure package.json) Instal·lades swagger-ui-express i swagger-jsdoc
// 4.2 Configuració inicial de Swagger: Arxiu base de configuració per la documentació
const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'E-commerce API',
      version: '1.0.0',
      description: "Documentació de l'API del projecte e-commerce",
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
    components: {
      // 4.6 Autenticació amb Swagger: Configuració JWT per provar endpoints protegits
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      // 4.5 Definició de models (schemas): Esquemes reutilitzables per a l'API
      schemas: {
        User: {

          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
          },
        },
        Product: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number' },
            stock: { type: 'number' }
          }
        }
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
