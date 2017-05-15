import test from 'ava';
import fs from 'fs-extra';
import { homedir } from 'os';
import path from 'path';

import needsPull from './index';

const fixtures = path.join(process.cwd(), 'test', 'fixtures');

const folders = [
  'detached',
  'detachedBranch',
  'pull',
  'pullNeedsMerge',
  'upToDate',
  'localBranch',
  'emptyGit',
];

test.before('rename git folders', () => {
  folders.map(folder => fs.renameSync(path.join(fixtures, folder, 'git'), path.join(fixtures, folder, '.git')));
});

test.after.always('rename .git folders', () => {
  folders.map(folder => fs.renameSync(path.join(fixtures, folder, '.git'), path.join(fixtures, folder, 'git')));
});

test('a local branch needs to get pushed', (t) => {
  t.true(needsPull(path.join(fixtures, 'detached'), { branch: 'check/pull' }));
});

test('need to pull', (t) => {
  t.true(needsPull(path.join(fixtures, 'pull')));
});

test('need to pull from branch', (t) => {
  t.true(needsPull(path.join(fixtures, 'detachedBranch'), { branch: 'check/pull' }));
});

test('needs pull, but pull needs require a merge', (t) => {
  t.true(needsPull(path.join(fixtures, 'pullNeedsMerge')));
});

test('up to date', (t) => {
  t.false(needsPull(path.join(fixtures, 'upToDate')));
});

test('local branch with one new commit', (t) => {
  t.false(needsPull(path.join(fixtures, 'localBranch')));
});

test('empty git - no pull', (t) => {
  t.false(needsPull(path.join(fixtures, 'emptyGit')));
});


test('homedir should not be a git repo', (t) => {
  t.false(needsPull(homedir()));
});
