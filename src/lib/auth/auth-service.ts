import { User } from '../schemas/auth';

// In-memory storage for demo purposes
// In production, you would use a database like Prisma with PostgreSQL
const users: User[] = [];
let nextId = 1;

export interface CreateUserData {
  email: string;
  name: string;
  image?: string;
  provider: string;
  providerId: string;
}

export class AuthService {
  static async createOrUpdateUser(data: CreateUserData): Promise<User> {
    const existingUser = users.find(user => user.email === data.email);
    
    if (existingUser) {
      // Update existing user
      existingUser.name = data.name;
      existingUser.image = data.image;
      existingUser.updatedAt = new Date();
      return existingUser;
    }

    // Create new user
    const newUser: User = {
      id: nextId.toString(),
      email: data.email,
      name: data.name,
      image: data.image,
      emailVerified: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    users.push(newUser);
    nextId++;
    
    return newUser;
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    return users.find(user => user.email === email) || null;
  }

  static async getUserById(id: string): Promise<User | null> {
    return users.find(user => user.id === id) || null;
  }

  static async getAllUsers(): Promise<User[]> {
    return users;
  }

  static async deleteUser(id: string): Promise<boolean> {
    const index = users.findIndex(user => user.id === id);
    if (index > -1) {
      users.splice(index, 1);
      return true;
    }
    return false;
  }

  static async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    const user = users.find(user => user.id === id);
    if (user) {
      Object.assign(user, updates, { updatedAt: new Date() });
      return user;
    }
    return null;
  }
}
