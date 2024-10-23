import dotenv from 'dotenv';
import { initDb, UserDb } from './store/userDb';
import worker from './worker';
import loadBalancer from './loadBalancer';

dotenv.config();

const PORT = parseInt(process.env.PORT as string) || 3000;
let db = initDb();

const getDb = () => {
  return db;
};
const setDb = (newDb: UserDb) => {
  db = newDb;
};

const isMulti = process.argv.includes('--multi');

if (isMulti) {
  loadBalancer(PORT, getDb, setDb);
} else {
  worker(PORT, getDb);
}
