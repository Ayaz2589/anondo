import { User } from '@prisma/client';
import { prisma } from '../prisma';

export interface CreateUserData {
  email: string;
  name: string;
  image?: string;
  provider: string;
  providerId: string;
}

export class AuthService {
  static async createOrUpdateUser(data: CreateUserData): Promise<User> {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    });
    
    if (existingUser) {
      // Update existing user
      return await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          name: data.name,
          image: data.image,
          emailVerified: new Date(),
        }
      });
    }

    // Create new user
    return await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        image: data.image,
        emailVerified: new Date(),
      }
    });
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { email }
    });
  }

  static async getUserById(id: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { id }
    });
  }

  static async getAllUsers(): Promise<User[]> {
    return await prisma.user.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  static async deleteUser(id: string): Promise<boolean> {
    try {
      await prisma.user.delete({
        where: { id }
      });
      return true;
    } catch {
      return false;
    }
  }

  static async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    try {
      return await prisma.user.update({
        where: { id },
        data: updates
      });
    } catch {
      return null;
    }
  }
}
