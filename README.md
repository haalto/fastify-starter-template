# Opionated Fastify starter template

Another one starter template for Fastify. This one is opinionated and uses Purify-ts for functional programming.

## Features

- Fastify
- TypeScript
- Jest
- Purify-ts
- Local docker-compose setup
- Dependency injection
- CI/CD pipeline (GitHub Actions)

## Todo

- Kysely for database access
- Test containers for integration tests
- Actual tests utilizing fakes
- Cache layer (Redis)

## Usage

Copy `.env.local` to `.env` and fill in the values. Check `docker-compose.yml` for the database credentials.

```bash
npm install
```

```bash
docker-compose up
npm start
```

```bash
npm test
```
