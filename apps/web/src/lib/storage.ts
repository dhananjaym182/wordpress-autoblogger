import fs from 'fs/promises';
import path from 'path';
import { createId } from '@/lib/id';

const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

const extensionFromContentType = (contentType: string | null) => {
  if (!contentType) return null;
  if (contentType.includes('png')) return '.png';
  if (contentType.includes('webp')) return '.webp';
  if (contentType.includes('gif')) return '.gif';
  if (contentType.includes('jpeg') || contentType.includes('jpg')) return '.jpg';
  return null;
};

const extensionFromUrl = (url: string) => {
  try {
    const pathname = new URL(url).pathname;
    const ext = path.extname(pathname);
    return ext || null;
  } catch {
    return null;
  }
};

const buildFileName = (extension: string | null) => {
  const safeExtension = extension || '.jpg';
  return `${createId('img')}${safeExtension}`;
};

const ensureUploadsDir = async () => {
  await fs.mkdir(UPLOADS_DIR, { recursive: true });
};

export const buildPublicUrl = (key: string) => `/${key}`;

export const saveBufferToUploads = async (buffer: Buffer, extension: string | null) => {
  await ensureUploadsDir();

  const fileName = buildFileName(extension);
  const filePath = path.join(UPLOADS_DIR, fileName);
  await fs.writeFile(filePath, buffer);

  return {
    key: `uploads/${fileName}`,
    publicUrl: buildPublicUrl(`uploads/${fileName}`),
  };
};

export const saveFileToUploads = async (file: File) => {
  const buffer = Buffer.from(await file.arrayBuffer());
  const extension = path.extname(file.name) || extensionFromContentType(file.type);
  return saveBufferToUploads(buffer, extension || null);
};

export const saveRemoteImageToUploads = async (url: string, buffer: Buffer, contentType?: string | null) => {
  const extension = extensionFromContentType(contentType ?? null) || extensionFromUrl(url);
  return saveBufferToUploads(buffer, extension ?? null);
};
