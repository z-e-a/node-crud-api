# CRUD API 

## Description
Simple CRUD API server with in-memory database using Node.js APIs created as a homework at course [NodeJS 2024Q3](https://rs.school/courses/nodejs).

### Sever provides following endpoints and methods:


| Endpoint            | Method | Description                     | Returns                                                                                                                          |
|---------------------|--------|---------------------------------|----------------------------------------------------------------------------------------------------------------------------------|
| api/users           | GET    | get all persons                 | 200                                                                                                                              |
| api/users/${userId} | GET    | get record with `id === userId` | 200 and record in body; <br>400 `userId` is invalid; <br>404 if record doesn't exist                                                     |
| api/users           | POST   | create new user record          | 201 and created record; <br>400 if request `body` does not contain required fields                                                   |
| api/users/${userId} | PUT    | update existing user            | 200 and updated record; <br>400 if `userId` is invalid (not `uuid`); <br>404 if record with `id === userId` doesn't exist            |
| api/users/${userId} | DELETE | delete existing user            | 204 if the record is found and deleted; <br>400 if `userId` is invalid (not `uuid`); <br>404 if record with `id === userId` doesn't exist |


## Technical requirements

- Used only allowed dependencies `nodemon`, `dotenv`, `typescript`, `ts-node`, `ts-node-dev`, `jest`, `supertest`, `eslint` and its plugins, `webpack-cli`, `webpack` and its plugins, `prettier`, `uuid`, `@types/*`
- Tested on recommended 22.x.x version of Node.js (exactly v22.9.0)
- Installed [Git](https://git-scm.com/downloads)
- Installed [Node.js](https://nodejs.org/en/download/) and the npm package manager

## Setup


- Clone the repository 
```bash
git clone https://github.com/z-e-a/node-crud-api.git
```

- Install dependencies
```bash
npm install
```

- Setup environment variables
Edit a .env file and set the following environment variables in it:  
`PORT`: Port number for the server to listen on (for example 3000)


## Usage

Launch an app in development mode with auto-reloading using `nodemon`:
```bash
npm run start:dev
```

Launch an app in production mode by building with webpack:
```bash
npm run start:prod
```

Launch an application with a load balancer in development mode:
```bash
start:multi-dev
```

Launch an application with a load balancer in production mode:
```bash
start:multi
```

## Testing

- Use `npm run test` to run predefined integration tests with `jest`

- To use Postman application for making requests you can import prepared collection in:   
`postman-collection/Basic CRUD API.postman_collection.json`