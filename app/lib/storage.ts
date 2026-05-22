import { writeFile, unlink, mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

const STORAGE_DIR = process.env.STORAGE_DIR || path.join(process.cwd(), 'storage');

export const storage = {
  async saveFile(key: string, data: Buffer | string): Promise<string> {
    const filePath = path.join(STORAGE_DIR, key);
    const dir = path.dirname(filePath);
    if (!existsSync(dir)) {
      await mkdir(dir, { recursive: true });
    }
    await writeFile(filePath, data);
    return filePath;
  },

  async deleteFile(key: string): Promise<void> {
    const filePath = path.join(STORAGE_DIR, key);
    if (existsSync(filePath)) {
      await unlink(filePath);
    }
  },

  async exists(key: string): Promise<boolean> {
    const filePath = path.join(STORAGE_DIR, key);
    return existsSync(filePath);
  },

  getFileUrl(key: string): string {
    return `/api/storage/${key}`;
  }
};
