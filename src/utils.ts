import http from 'node:http';
import { StatusCodes } from './types/util';

export function responseWithNotFound(response: http.ServerResponse) {
  const status = StatusCodes.NOT_FOUND;
  response.statusCode = status;
  response.setHeader('Content-Type', 'application/json');
  response.end(JSON.stringify({ message: http.STATUS_CODES[status] }));
}

export function getUserFromBody(request: http.IncomingMessage) {
  return new Promise((resolve, reject) => {
    const data: Buffer[] = [];

    request.on('data', (chunk) => {
      data.push(chunk);
    });

    request.on('end', () => {
      try {
        resolve(JSON.parse(Buffer.concat(data).toString()));
      } catch (error) {
        reject(error);
      }
    });

    request.on('error', (error) => {
      reject(error);
    });
  });
}
