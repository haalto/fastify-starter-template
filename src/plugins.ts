import { FastifyInstance } from "fastify";
import fastifySensible from "@fastify/sensible";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";

export const configurePlugins = (app: FastifyInstance) => {
  app.register(fastifySensible);

  /**
   * Swagger
   */
  app.register(fastifySwagger, {
    mode: "dynamic",
    openapi: {
      info: {
        title: "Todo API",
        description: "Todo API",
        version: "1.0.0",
      },
    },
  });

  app.register(fastifySwaggerUi, {
    routePrefix: "/docs",
    initOAuth: {},
    uiConfig: {
      docExpansion: "full",
      deepLinking: false,
    },
    uiHooks: {
      onRequest: function (request, reply, next) {
        next();
      },
      preHandler: function (request, reply, next) {
        next();
      },
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
  });
};
