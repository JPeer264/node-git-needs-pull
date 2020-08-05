import path from 'path';
import fs from 'fs-extra';
import { homedir } from 'os';
import tempDir from 'temp-dir';
import { v4 as uuidv4 } from 'uuid';

import needsPull from '../index';

const fixtures = path.join(tempDir, 'sgc', uuidv4());
const localFixtures = path.join(process.cwd(), '__tests__', 'fixtures');

const folders = [
  'detached',
  'detachedBranch',
  'pull',
  'pullNeedsMerge',
  'upToDate',
  'localBranch',
  'emptyGit',
];

beforeAll(() => {
  fs.copySync(localFixtures, fixtures);
  folders.forEach((folder) => {
    fs.renameSync(path.join(fixtures, folder, 'git'), path.join(fixtures, folder, '.git'));
  });
});

afterAll(() => {
  fs.removeSync(fixtures);
});

test('a local branch needs to get pushed', () => {
  expect(needsPull(path.join(fixtures, 'detached'), { branch: 'check/pull' })).toBe(true);
});

test('need to pull', () => {
  expect(needsPull(path.join(fixtures, 'pull'))).toBe(true);
});

test('need to pull from branch', () => {
  expect(needsPull(path.join(fixtures, 'detachedBranch'), { branch: 'check/pull' })).toBe(true);
});

test('needs pull, but pull needs require a merge', () => {
  expect(needsPull(path.join(fixtures, 'pullNeedsMerge'))).toBe(true);
});

test('up to date', () => {
  expect(needsPull(path.join(fixtures, 'upToDate'))).toBe(false);
});

test('local branch with one new commit', () => {
  expect(needsPull(path.join(fixtures, 'localBranch'))).toBe(false);
});

test('empty git - no pull', () => {
  expect(needsPull(path.join(fixtures, 'emptyGit'))).toBe(false);
});

test('homedir should not be a git repo', () => {
  expect(needsPull(homedir())).toBe(false);
});
