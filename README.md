# Node - Koa - Typescript Project

When running the project locally with `watch-server`, being `.env` file config the very same as `.example.env` file, the swagger docs will be deployed at: `http:localhost:3000/swagger-html`, and the bearer token for authorization should be as follows:

HEADER (LOCALHOST BASED ON DEFAULT SECRET KEY 'your-secret-whatever')

```
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJuYW1lIjoiSmF2aWVyIEF2aWxlcyIsImVtYWlsIjoiYXZpbGVzbG9wZXouamF2aWVyQGdtYWlsLmNvbSJ9.rgOobROftUYSWphkdNfxoN2cgKiqNXd4Km4oz6Ex4ng
```

| method   | resource      | description                                                                                    |
| :------- | :------------ | :--------------------------------------------------------------------------------------------- |
| `GET`    | `/`           | Simple hello world response                                                                    |
| `GET`    | `/users`      | returns the collection of users present in the DB                                              |
| `GET`    | `/users/:id`  | returns the specified id user                                                                  |
| `POST`   | `/users`      | creates a user in the DB (object user to be includued in request's body)                       |
| `PUT`    | `/users/:id`  | updates an already created user in the DB (object user to be includued in request's body)      |
| `DELETE` | `/users/:id`  | deletes a user from the DB (JWT token user ID must be the same as the user you want to delete) |
| `GET`    | `/tables`     | returns the collection of tables present in the DB                                             |
| `GET`    | `/tables/:id` | returns the specified table by id user                                                         |
| `POST`   | `/tables`     | creates a table in the DB (object table to be includued in request's body)                     |
| `PUT`    | `/tables/:id` | updates an already created table in the DB (object user to be includued in request's body)     |
| `DELETE` | `/tables/:id` | deletes a table from the DB                                                                    |
| `GET`    | `/bookings`   | returns the collection of bookings present in the DB                                           |
| `POST`   | `/bookings`   | creates a booking in the DB (object booking to be includued in request's body)                 |
| `GET`    | `/setting`    | returns the restaurant setting for open and close time                                         |
| `POST`   | `/setting`    | updates the open and close time setting                                                        |

## Pre-reqs

To build and run this app locally you will need:

- Install [Node.js](https://nodejs.org/en/)

## Features:

- Nodemon - server auto-restarts when code changes
- Koa v2
- TypeORM (SQL DB) with basic CRUD included
- Swagger decorator (auto generated swagger docs)
- Class-validator - Decorator based entities validation
- Docker-compose ready to go
- Postman (newman) integration tests
- Locust load tests
- Jest unit tests
- Github actions - CI for building and testing the project
- Cron jobs prepared

## Included middleware:

- @koa/router
- koa-bodyparser
- Winston Logger
- JWT auth koa-jwt
- Helmet (security headers)
- CORS

# Getting Started

- Clone the repository

```
git clone https://github.com/bluesky0724/Restaurant-be-koa.git
```

- Install dependencies

```
cd Restaurant-be-koa
npm install
```

- Run the project directly in TS

```
npm run watch-server
```

- Build and run the project in JS

```
npm run build
npm run start
```

- Run integration or load tests

```
npm run test:integration:local (newman needed)
npm run test:load (locust needed)
```

- Run unit tests

```
npm run test
```

- Run unit tests with coverage

```
npm run test:coverage
```

- Run unit tests on Jest watch mode

```
npm run test:watch
```

## Docker (optional)

A docker-compose file has been added to the project with a postgreSQL (already setting user, pass and dbname as the ORM config is expecting) and an ADMINER image (easy web db client).

It is as easy as go to the project folder and execute the command 'docker-compose up' once you have Docker installed, and both the postgreSQL server and the Adminer client will be running in ports 5432 and 8080 respectively with all the config you need to start playing around.

If you use Docker natively, the host for the server which you will need to include in the ORM configuration file will be localhost, but if you were to run Docker in older Windows versions, you will be using Boot2Docker and probably your virtual machine will use your ip 192.168.99.100 as network adapter (if not, command `docker-machine ip` will tell you). This mean your database host will be the aforementioned ip and in case you want to access the web db client you will also need to go to http://192.168.99.100/8080

Run docker compose

```
docker compose up --build
```

## Development Process

### Fork boilarplate project for koa.js

Searched github boilarplates for koa.js + typescript + orm + swagger + testing.
I forked this repo: https://github.com/javieraviles/node-typescript-koa-rest

### Design REST APIs and DB

To implement Booking manager API, we need

- Setting API for open and close time setting
- Table API for creating new table
- Booking API for creating, editing and removing reservation

## Write Test cases for controller functions

Using jest, test cases for every controller functions were written.
TypeORM decorators are mockes as empty function since it doesn't need testing.

### Implement APIs and Entities

Based on the existing code structure, additional controllers, entities and routers are implemented until all the test cases are passed.

### Report test coverage

By using jest, we measured test coverage.
