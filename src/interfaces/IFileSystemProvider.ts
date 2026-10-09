import { FileEntry } from '../types';

export interface ListDirectoryOptions {
  readonly showHidden?: boolean;
}

export interface IFileSystemProvider {
  listDirectory(dirPath: string, options?: ListDirectoryOptions): Promise<FileEntry[]>;
  isDirectory(path: string): Promise<boolean>;
  exists(path: string): Promise<boolean>;
  getParentPath(path: string): string;
  getBaseName(path: string): string;
  joinPath(...segments: string[]): string;
  getHomeDirectory(): string;
  readFile(filePath: string): Promise<string>;
  writeFile(filePath: string, content: string): Promise<void>;
  createFile(filePath: string): Promise<void>;
  createDirectory(dirPath: string): Promise<void>;
  deleteFile(filePath: string): Promise<void>;
  deleteDirectory(dirPath: string): Promise<void>;
}
