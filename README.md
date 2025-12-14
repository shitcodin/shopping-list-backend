# Shopping List API

Node.js + Express implementation of the HW3–HW5 Shopping List API (uuCmd-style) without uuApp framework. Uses MongoDB (Mongoose), Joi validation, and JWT for authentication/authorization.

## Prerequisites

- Node.js 
- MongoDB instance (local or remote)

## Setup

```bash
cp .env.example .env
# adjust PORT, MONGODB_URI, JWT_SECRET
npm install
```

## Run

```bash
npm start    # production mode
npm run dev  # with nodemon
```

API base URL defaults to `http://localhost:3000`. Use `auth/mockLogin` to get a JWT for manual testing.

## Test

```bash
npm test
```

Jest + supertest + mongodb-memory-server simulate the five uuCmds (happy path + alternative scenarios).

## Project Highlights

- uuCmd structure: route → command (validation + uuAppErrorMap) → ABL → DAO → MongoDB.
- `requireAuth`, `authorizeProfiles`, and owner enforcement middleware for JWT-based RBAC.
- `uuAppErrorMap` style responses for warnings/errors (unsupportedKeys, invalidDtoIn, etc.).
- Insomnia collection under `test/insomnia/collection.json`.
