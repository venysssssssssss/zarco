import { User } from '@/types/auth';
import { createUser, findUserById, validateUserCredentials } from '@/lib/db/userRepository';

export async function registerUser(name: string, email: string, password: string): Promise<(User & { password: string }) | null> {
  return createUser(name, email, password);
}

export async function validateCredentials(email: string, password: string): Promise<(User & { password: string }) | null> {
  return validateUserCredentials(email, password);
}

export async function getUserById(id: string): Promise<User | null> {
  return findUserById(id);
}