import cluster from 'node:cluster';
import http from 'node:http';
import { UserDb } from './store/userDb';
import worker from './worker';
import { availableParallelism } from 'node:os';
import { StatusCodes } from './types/util';
import { IUser } from './types/entity';

const loadBalancer = (initPort: number, getDb: () => UserDb, setDb: (newDb: UserDb) => void) => {
  if (cluster.isPrimary) {
    const maxWorkers = availableParallelism() - 1;
    for (let i = 0; i < maxWorkers; i++) {
      const worker = cluster.fork({ WORKER_PORT: initPort + i + 1 });

      worker.on('message', (message) => {
        setDb(new UserDb(message.data));
        for (const currentWorker of Object.values(cluster.workers ?? {})) {
          currentWorker?.send(message);
        }
      });
    }

    let currentWorker = 0;
    const server = http.createServer(
      async (incomingRequest: http.IncomingMessage, outgoingResponse: http.ServerResponse) => {
        try {
          currentWorker = (maxWorkers + currentWorker + 1) % maxWorkers;
          const proxyRequest = http.request(
            {
              hostname: 'localhost',
              port: initPort + currentWorker + 1,
              path: incomingRequest.url,
              headers: incomingRequest.headers,
              method: incomingRequest.method,
            },
            (proxyResponse) => {
              Object.keys(proxyResponse.headers).forEach((header) => {
                outgoingResponse.setHeader(header, String(proxyResponse.headers[header]));
              });
              proxyResponse.pipe(outgoingResponse);
            },
          );
          incomingRequest.pipe(proxyRequest);
        } catch (error) {
          const status = StatusCodes.SERVER_ERROR;
          outgoingResponse.statusCode = status;
          outgoingResponse.end(JSON.stringify({ message: http.STATUS_CODES[status], error: (error as Error).message }));
        }
      },
    );

    server.listen(initPort, () => {
      console.log(`load balancer started listening port: ${initPort} with process ID: ${process.pid}`);
    });
  }

  if (cluster.isWorker) {
    const workerPort = parseInt(process.env.WORKER_PORT ?? String(initPort + 1));
    worker(workerPort, getDb);

    process.on('message', (message: { data: IUser[] }) => {
      setDb(new UserDb(message.data));
    });
  }
};

export default loadBalancer;
