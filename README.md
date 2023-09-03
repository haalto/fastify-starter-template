# Opionated Fastify starter template

Another starter template for Node backend with Fastify. This one is opinionated and uses Purify-ts for functional programming. This template is meant to be used as a starting point for new projects. It has all the basic stuff like CI/CD pipeline, Docker setup, integration tests, etc. It also has some basic stuff like logging, error handling, etc.

It's not meant to be a full blown production ready template, but it should be a good starting point for new small to mid sized projects.

## Features

- Fastify
- TypeScript
- Jest
- Purify-ts
- Local docker-compose setup
- Dependency injection
- Integration tests with test containers
- CI/CD pipeline (GitHub Actions)
- JSON schemas for request validation and response serialization

## Usage

Run docker-compose to start local development environment. If you want to run application outside of Docker setup env file with correct values from .env.local and run `npm install && npm start`.

Run local development environment

```bash
docker-compose up
```

Run tests. Watch mode is enabled by default.

```bash
npm test
```

Format code with prettier

```bash
npm run format
```

Lint code with eslint

```bash
npm run lint
```

```bash
npm run lint-and-fix
```

Create a new migration

```bash
npm run migration:create
```

## License

MIT
