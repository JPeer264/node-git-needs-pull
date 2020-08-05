import currentBranch from 'current-git-branch';
import execa from 'execa';
import commitCount from 'git-commit-count';
import path from 'path';
import isAbsolute from 'is-absolute';

export interface Options {
  remote?: string;
  branch?: string;
}

const gitNeedsPull = (cwd = process.cwd(), { remote, branch }: Options = {}): boolean => {
  const thisPath = isAbsolute(cwd) ? cwd : path.join(cwd, cwd);
  const r = remote || 'origin';

  if (commitCount(thisPath) <= 0) {
    return false;
  }

  let b = branch || currentBranch(thisPath);

  b = b && b.slice(0, 14) !== '(HEAD detached' ? b : 'master';

  try {
    const updateExec = 'git fetch';
    const localCommitExec = 'git rev-parse HEAD';
    const remoteCommitExec = `git rev-parse ${r}/${b}`;
    const lastCommonCommitExec = `git merge-base HEAD ${r}/${b}`;

    execa.commandSync(updateExec, { cwd: thisPath });

    const localCommit = execa.commandSync(localCommitExec, { cwd: thisPath }).stdout;
    const remoteCommit = execa.commandSync(remoteCommitExec, { cwd: thisPath }).stdout;

    if (localCommit === remoteCommit) {
      return false;
    }

    const lastCommonCommit = execa.commandSync(lastCommonCommitExec, { cwd: thisPath }).stdout;

    if (lastCommonCommit === localCommit) {
      return true;
    }

    return false;
  } catch (e) {
    return false;
  }
};

export default gitNeedsPull;
