import { readdir } from 'fs/promises';

export async function getMediaNames(path: string) {
  try {
    return await readdir(path);
  } catch (error) {
    console.error(error);
    return [];
  }
}
