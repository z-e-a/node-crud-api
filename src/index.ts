import dotenv from 'dotenv';
import { initDb } from './store/userDb';
import worker from './worker';

dotenv.config();

const PORT = parseInt(process.env.PORT as string) || 3000;
const db = initDb();

const isMulti = process.argv.includes('--multi');

if (isMulti) {
  console.log('start in multi-instance mode');
} else {
  worker(PORT, db);
}
