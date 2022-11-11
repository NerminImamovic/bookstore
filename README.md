# Bookstore

## Node.js Booksore Assignment (Q agency) - Nermin Imamovic

A few things to note in the project:
* **[Github Actions Workflows](https://github.com/NerminImamovic/bookstore/tree/master/.github/workflows)** -
`ci.yml`, continuous integration for the project 

* **[Dockerfile](https://github.com/NerminImamovic/bookstore/blob/master/Dockerfile)** - Dockerfile to generate docker builds.

* **[docker-compose](https://github.com/NerminImamovic/bookstore/blob/master/docker-compose.yml)** - Docker compose script to start service in production mode.

* **[Containerized MySQL for development](#iii-development)** - Starts a local mysql container with data persistence across runs.

* **[.env file for configuration](#environment)** - Change server config like app mysql port etc.

* **OpenAPI 3.0 Spec Swagger** - A starter template to get started with API documentation using OpenAPI 3.0. This API spec is also available when running the server at `http://localhost:3000/docs`
* **ESLINT** - ESLINT is configured for linting.
* **Jest** - Using Jest for running test cases

## I. Installation

---

### Prerequisites
Make sure you have installed all of the following prerequisites on your development machine:
* Git
* Node.js (v.14.17)
* Docker (v.20.10.)

---

#### 1. Clone this repo

```
$ git clone git@github.com:NerminImamovic/bookstore
$ cd bookstore
```

#### 2. Install dependencies

```
$ npm install
```

## II. Configuration

Be sure that you have installed docker on your local machine, and any service related do MySQL is turned off. 

Configuration is provided in `env.default` file for development and local running, and in `env.test` for the test running. Also for making production build we have configuration in `docker-compose.yml` file.

Read more about **[environment variables](#environment)** used in the project.

## III. Development

### Start dev server
Starting the dev server also starts MySql as a service in a docker container using the compose script at `docker-compose.local.yml`.

```
$ docker-compose -f docker-compose.local.yml up -d
```

```
$ npm run dev
```
Running the above commands results in 
* **API Server** running at `http://localhost:3000/`
* **Swagger** running at `http://localhost:3000/docs`
* **MySql** running at PORT `3306`

(feel free to change the env variables in .env.default)

## IV. Packaging and Deployment

#### 1. Build and run using npm scripts 

In the background `docker-compose.local.yml` will be started to provide mysql

```
$ docker-compose -f docker-compose.local.yml up -d
```

We need to run migrations and seed our database

```
$ npm run migrate
```

```
$ npm run build && npm run start
```

#### 2. Run with docker

We can make production build using docker.

Build docker image.

```
$ docker build -t api-server .
```

Start application using docker-compose.

```
$ docker-compose up
```

or simply run

```
$ docker-compose up --build
```

then run migrations for our database

```
$ npm run migrate
```

## V. Test

Run unit tests using the next npm script:

```
$ npm run test
```

---

As the result we will also have code coverage through files.

## Environment
There are environment variables for development and test environments in files `env.default` and `env.test`. For production env variables are in `docker-compose.yml` file.

| Var Name  | Type  | Default | Description  |
|---|---|---|---|
| DB_TYPE  | string  | `mysql` | DB Type eg: `mysql`  
| DB_HOST  | string  | `localhost` | DB Host eg: `localhost`  |
| DB_PORT  | number  | 3306 | DB Port eg: `3306`  |
| DB_USERNAME  | string  | `root` | DB UserName eg: `root`  |
| DB_PASSWORD  | string  | `password` | DB Password eg: `password`  |
| DB_NAME  | string  | `database` | DB Type eg: `database`  |
| JWT_SECRET | string  | `secret` | Jwt Secret |
