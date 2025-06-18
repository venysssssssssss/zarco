import { v4 as uuidv4 } from 'uuid';
import { User } from '@/types/auth';
import db from './database';
import bcrypt from 'bcryptjs';

export async function findUserByEmail(email: string): Promise<(User & { password: string }) | null> {
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as (User & { password: string }) | null;
  return user;
}

export async function findUserById(id: string): Promise<User | null> {
  const user = db.prepare('SELECT id, name, email FROM users WHERE id = ?').get(id) as User | null;
  return user;
}

export async function createUser(name: string, email: string, password: string): Promise<(User & { password: string }) | null> {
  // Verificar se o usuário já existe
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    return null;
  }
  
  // Criptografar a senha
  const hashedPassword = await bcrypt.hash(password, 10);
  
  // Criar novo usuário
  const id = uuidv4();
  
  const insert = db.prepare(
    'INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)'
  );
  
  insert.run(id, name, email, hashedPassword);
  
  return {
    id,
    name,
    email,
    password: hashedPassword
  };
}

export async function validateUserCredentials(email: string, password: string): Promise<(User & { password: string }) | null> {
  const user = await findUserByEmail(email);
  
  if (!user) {
    return null;
  }
  
  const isValid = await bcrypt.compare(password, user.password);
  
  return isValid ? user : null;
}