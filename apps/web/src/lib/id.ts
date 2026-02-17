import { customAlphabet } from 'nanoid';

export const generateId = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 16);

export const generateToken = () => generateId(32);
