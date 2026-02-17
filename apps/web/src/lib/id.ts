import { customAlphabet } from 'nanoid';

export const generateId = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 16);

export const createId = (prefix?: string) => {
  const id = generateId();
  return prefix ? `${prefix}_${id}` : id;
};

export const generateToken = () => generateId(32);
