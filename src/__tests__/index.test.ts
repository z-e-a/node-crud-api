import dotenv from 'dotenv';
import request from 'supertest';
import { initDb, UserDb } from '../store/userDb';
import worker from '../worker';
import initialDbContent from '../store/initialDbContent';
import { expect, jest, test, beforeAll, afterAll, describe } from '@jest/globals';
import { validate } from 'uuid';

dotenv.config();
const PORT = parseInt(process.env.PORT as string) || 3000;
let db = initDb();
const getDb = () => {
  return db;
};

describe('CRUD tests', () => {
  let shutdownServer: () => void;
  let createdUserId = '';

  beforeAll(async () => {
    shutdownServer = await worker(PORT, getDb);
  });

  afterAll(() => {
    shutdownServer();
  });

  test('Scenario 1: Get all users', async () => {
    const response = await request(`localhost:${PORT}`).get('/api/users');
    expect(response.status).toBe(200);
    expect(JSON.parse(response.text)).toStrictEqual(initialDbContent);
  });

  test('Scenario 2: Add new user', async () => {
    const newUser = {
      username: 'John',
      age: 22,
      hobbies: ['fishing'],
    };
    const postResponse = await request(`localhost:${PORT}`)
      .post('/api/user')
      .send(newUser)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    const createdUser = JSON.parse(postResponse.text).data;
    createdUserId = createdUser.id;
    expect(postResponse.status).toBe(201);
    expect(validate(createdUserId)).toBeTruthy();
    delete createdUser['id'];
    expect(createdUser).toStrictEqual(newUser);

    const getResponse = await request(`localhost:${PORT}`).get((`/api/user/${createdUserId}`));
    expect(getResponse.status).toBe(200);

  });

  test('Scenario 3: Update user', async () => {
    const newUserData = {
      id: `${createdUserId}`,
      username: 'James',
      age: 33,
      hobbies: ['drinking'],
    };

    const response = await request(`localhost:${PORT}`)
      .put(`/api/user/${createdUserId}`)
      .send(newUserData)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    const updatedUser = JSON.parse(response.text).data;
    expect(response.status).toBe(200);
    expect(updatedUser).toStrictEqual(newUserData);
  });

  test('Scenario 3: Delete user', async () => {
    const delResponse = await request(`localhost:${PORT}`)
      .delete(`/api/user/${createdUserId}`);
    expect(delResponse.status).toBe(204);

    const getResponse = await request(`localhost:${PORT}`).get((`/api/user/${createdUserId}`));
    expect(getResponse.status).toBe(404);
  });
});
