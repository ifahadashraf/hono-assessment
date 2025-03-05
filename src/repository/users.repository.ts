import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

interface User {
  id: string;
  name: string;
  email: string;
}

interface Data {
  users: User[];
}

export class UsersRepository {
  private db: Low<Data>;

  constructor() {
    const file = new JSONFile<Data>('db.json');
    this.db = new Low(file, { users: [] });
    this.initializeDb();
  }

  private async initializeDb() {
    await this.db.read().catch(() => console.log('Empty database'));
    this.db.data ||= { users: [] };
    await this.db.write();
  }

  getTotalUsersCount = () => {
    return this.db.data!.users.length;
  }

  async getUsers(page = 1, limit = 10): Promise<User[]> {
    await this.db.read();
    const start = (page - 1) * limit;
    const end = start + limit;
    return this.db.data!.users.slice(start, end);
  }

  async getUserById(id: string): Promise<User | undefined> {
    await this.db.read();
    return this.db.data!.users.find(user => user.id === id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    await this.db.read();
    return this.db.data!.users.find(user => user.email === email);
  }

  async addUser(user: User): Promise<void> {
    await this.db.read();
    this.db.data!.users.push(user);
    await this.db.write();
  }

  async updateUser(id: string, updatedUser: Partial<User>): Promise<void> {
    await this.db.read();
    const userIndex = this.db.data!.users.findIndex(user => user.id === id);
    if (userIndex !== -1) {
      this.db.data!.users[userIndex] = { ...this.db.data!.users[userIndex], ...updatedUser };
      await this.db.write();
    }
  }

  async deleteUser(id: string): Promise<void> {
    await this.db.read();
    this.db.data!.users = this.db.data!.users.filter(user => user.id !== id);
    await this.db.write();
  }
}
