import { IUser } from 'src/types/entity';
import initialDbContent from './initialDbContent';
import { v4 as uuid } from 'uuid';

export class UserDb {
  private records: IUser[];

  constructor(initialContent: IUser[]) {
    this.records = initialContent;
  }

  public getAllUsers(): IUser[] {
    return this.records;
  }

  getUserById(id: string) {
    return this.records.filter((rec) => rec.id === id)[0];
  }

  createUser(newUser: IUser) {
    let isUniq = false;
    let newUuid = '';
    while (!isUniq) {
      newUuid = uuid();
      isUniq = this.records.filter((rec) => rec.id === newUuid).length === 0;
    }
    const newUserRecord = { id: newUuid, ...newUser };
    this.records = [...this.records, newUserRecord];
    return newUserRecord;
  }

  updateUserById(id: string, user: IUser) {
    const recordIndex = this.records.findIndex((rec) => rec.id === id);
    if (recordIndex == -1) {
      throw new Error(`user with id=${id} not found`);
    }
    this.records[recordIndex] = user;
  }

  deleteUserById(id: string) {
    const recordIndex = this.records.findIndex((rec) => rec.id === id);
    if (recordIndex == -1) {
      throw new Error(`user with id=${id} not found`);
    }
    this.records = this.records.filter((rec) => rec.id !== id);
  }
}

export const initDb = () => {
  return new UserDb(initialDbContent);
};
