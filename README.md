# Users REST API

This project is a server built with [Hono](https://hono.dev/), using components like `lowdb` for data storage, `Zod` for schema validation, and `Jest` for testing.

## Features

- Simple RESTful API with user routes.
- JSON prettification and logging.
- Structured request validation with `Zod`.
- Database with `lowdb`.
- OpenAPI documentation.
- Testing with `Jest`.

## Prerequisites

- Node.js (>= 14.x)
- yarn

## Installation

Clone the repository and install the dependencies:

```bash
yarn
```
To start the server, run:

```bash
yarn dev
```
The server will be running at ```http://localhost:3000``` by default.

## Routes

These are located under /api/users. 
Refer to openapi.spec.yaml for detailed endpoint information.

## Testing
Jest is used for testing. To run tests, execute:

```bash
yarn test
```

