// === FileSystemProvider tests: CRUD operations on a temporary filesystem ===

import assert from 'node:assert/strict';
import { afterEach, beforeEach, test } from 'node:test';
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { FileSystemProvider } from './FileSystemProvider';

const provider = new FileSystemProvider();
let tempDir: string;

beforeEach(async () => {
  tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'pi-file-browser-'));
});

afterEach(async () => {
  await fs.rm(tempDir, { recursive: true, force: true });
});

test('createFile creates an empty file', async () => {
  const filePath = path.join(tempDir, 'new.txt');
  await provider.createFile(filePath);
  assert.equal(await fs.readFile(filePath, 'utf8'), '');
});

test('createFile rejects an existing file without changing it', async () => {
  const filePath = path.join(tempDir, 'existing.txt');
  await fs.writeFile(filePath, 'original');
  await assert.rejects(provider.createFile(filePath), { code: 'EEXIST' });
  assert.equal(await fs.readFile(filePath, 'utf8'), 'original');
});

test('createDirectory creates a directory', async () => {
  const dirPath = path.join(tempDir, 'new-dir');
  await provider.createDirectory(dirPath);
  assert.equal((await fs.stat(dirPath)).isDirectory(), true);
});

test('createDirectory rejects an existing directory', async () => {
  const dirPath = path.join(tempDir, 'existing-dir');
  await fs.mkdir(dirPath);
  await assert.rejects(provider.createDirectory(dirPath), { code: 'EEXIST' });
});

test('deleteFile removes a file', async () => {
  const filePath = path.join(tempDir, 'delete.txt');
  await fs.writeFile(filePath, 'content');
  await provider.deleteFile(filePath);
  await assert.rejects(fs.stat(filePath), { code: 'ENOENT' });
});

test('deleteFile rejects a missing file', async () => {
  await assert.rejects(provider.deleteFile(path.join(tempDir, 'missing.txt')), { code: 'ENOENT' });
});

test('deleteDirectory recursively removes a nonempty directory', async () => {
  const dirPath = path.join(tempDir, 'delete-dir');
  const nested = path.join(dirPath, 'nested');
  await fs.mkdir(nested, { recursive: true });
  await fs.writeFile(path.join(nested, 'child.txt'), 'content');
  await provider.deleteDirectory(dirPath);
  await assert.rejects(fs.stat(dirPath), { code: 'ENOENT' });
});

test('deleteDirectory rejects a missing directory', async () => {
  await assert.rejects(provider.deleteDirectory(path.join(tempDir, 'missing-dir')), { code: 'ENOENT' });
});
