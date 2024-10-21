import dotenv from 'dotenv';
import { initDb } from './store/userDb';
import worker from './worker';
import loadBalancer from './loadBalancer';

dotenv.config();

const PORT = parseInt(process.env.PORT as string) || 3000;
const db = initDb();

const isMulti = process.argv.includes('--multi');

if (isMulti) {
  loadBalancer(PORT, db);
} else {
  worker(PORT, db);
}
