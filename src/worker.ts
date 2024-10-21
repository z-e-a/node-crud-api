import http from 'node:http';
import { UserDb } from './store/userDb';
import { HttpMethods, StatusCodes } from './types/util';
import { validate as validateUuid } from 'uuid';
import { IUser } from './types/entity';
import { getUserFromBody, responseWithNotFound } from './utils';
import cluster from 'node:cluster';

const worker = async (port: number, db: UserDb) => {
  const server = http.createServer(async (request: http.IncomingMessage, response: http.ServerResponse) => {
    try {
      const { url, method } = request;
      if (url?.match(/^\/api\/users\/?$/) && method === HttpMethods.GET) {
        const status = StatusCodes.OK;
        response.statusCode = status;
        response.setHeader('Content-Type', 'application/json');
        response.write(JSON.stringify(db.getAllUsers()));
        response.end();
      } else if (url && url.match(/(^\/api\/user)(.{0,}$)/)) {
        const userIdMatches = url.match(/(^\/api\/user\/)([a-zA-Z0-9-]+)$/) ?? [];
        let userId = null;
        let isIdValid = false;
        if (userIdMatches.length >= 2) {
          userId = userIdMatches[2];
          try {
            isIdValid = validateUuid(userId);
          } catch (error) {
            console.log(error);
          }
        }
        if (userId && isIdValid) {
          const userFromDb = db.getUserById(userId);
          if (userFromDb) {
            switch (method) {
              case HttpMethods.GET: {
                const status = StatusCodes.OK;
                response.statusCode = status;
                response.setHeader('Content-Type', 'application/json');
                response.write(JSON.stringify(userFromDb));
                response.end();
                break;
              }
              case HttpMethods.PUT: {
                const userFromBody: IUser = (await getUserFromBody(request)) as IUser;
                if (userFromBody && userFromBody.username && userFromBody.age && userFromBody.hobbies) {
                  db.updateUserById(String(userFromDb.id), userFromBody);
                  const status = StatusCodes.OK;
                  response.statusCode = status;
                  response.setHeader('Content-Type', 'application/json');
                  response.end(
                    JSON.stringify({ message: http.STATUS_CODES[status], data: db.getUserById(String(userFromDb.id)) }),
                  );
                } else {
                  const status = StatusCodes.BAD_REQUEST;
                  response.statusCode = status;
                  response.end(
                    JSON.stringify({
                      message: http.STATUS_CODES[status],
                      error: 'body does not contain required fields',
                    }),
                  );
                }

                break;
              }
              case HttpMethods.DELETE: {
                db.deleteUserById(String(userFromDb.id));
                const status = StatusCodes.NO_CONTENT;
                response.statusCode = status;
                response.end();
                break;
              }
              default: {
                const status = StatusCodes.NOT_ALLOWED;
                response.statusCode = status;
                response.end(JSON.stringify({ message: http.STATUS_CODES[status] }));
                break;
              }
            }
          } else {
            responseWithNotFound(response);
          }
        } else {
          if (method === HttpMethods.POST) {
            const userFromBody: IUser = (await getUserFromBody(request)) as IUser;
            if (userFromBody && userFromBody.username && userFromBody.age && userFromBody.hobbies) {
              const createdUser = db.createUser(userFromBody);
              const status = StatusCodes.CREATED;
              response.statusCode = status;
              response.setHeader('Content-Type', 'application/json');
              response.end(JSON.stringify({ message: http.STATUS_CODES[status], data: createdUser }));
            } else {
              const status = StatusCodes.BAD_REQUEST;
              response.statusCode = status;
              response.end(
                JSON.stringify({ message: http.STATUS_CODES[status], error: 'body does not contain required fields' }),
              );
            }
          } else {
            const status = StatusCodes.BAD_REQUEST;
            response.statusCode = status;
            response.setHeader('Content-Type', 'application/json');
            response.end(JSON.stringify({ message: http.STATUS_CODES[status], error: `user id is not valid` }));
          }
        }

        if (cluster.isWorker) {
          process.send?.({ data: db.getAllUsers() });
        }
      } else {
        responseWithNotFound(response);
      }
    } catch (error) {
      const status = StatusCodes.SERVER_ERROR;
      response.statusCode = status;
      response.end(JSON.stringify({ message: http.STATUS_CODES[status], error: (error as Error).message }));
    }
  });

  server.on('clientError', (err, socket) => {
    socket.end(`HTTP/1.1 400 Bad Request\r\n${err.message}\r\n`);
  });

  server.listen(port, () => {
    console.log(`worker started listening port: ${port} with process ID: ${process.pid}`);
  });

  return () => server.close();
};

export default worker;
