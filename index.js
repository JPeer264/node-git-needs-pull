import currentBranch from 'current-git-branch';
import execa from 'execa';
import commitCount from 'git-commit-count';
import { platform } from 'os';
import path from 'path';
import pathIsAbsolute from 'path-is-absolute';

const cwd = process.cwd();

const gitNeedsPull = (altPath = cwd, { remote, branch } = {}) => {
  const thisPath = pathIsAbsolute(altPath) ? altPath : path.join(cwd, altPath);
  const r = remote || 'origin';

  if (commitCount(thisPath) <= 0) {
    return false;
  }

  let b = branch || currentBranch(thisPath);

  b = b && b.slice(0, 14) !== '(HEAD detached' ? b : 'master';

  try {
    let updateExec;
    let localCommitExec;
    let remoteCommitExec;
    let lastCommonCommitExec;

    if (platform() === 'win32') {
      updateExec = `pushd ${thisPath} & git fetch"`;
      localCommitExec = `pushd ${thisPath} & git rev-parse "@"`;
      remoteCommitExec = `pushd ${thisPath} & git rev-parse ${r}/${b}`;
      lastCommonCommitExec = `pushd ${thisPath} & git merge-base "@" ${r}/${b}`;
    } else {
      updateExec = `(cd ${thisPath} ; git fetch)`;
      localCommitExec = `(cd ${thisPath} ; git rev-parse "@")`;
      remoteCommitExec = `(cd ${thisPath} ; git rev-parse ${r}/${b})`;
      lastCommonCommitExec = `(cd ${thisPath} ; git merge-base "@" ${r}/${b})`;
    }

    execa.shellSync(updateExec);

    const localCommit = execa.shellSync(localCommitExec).stdout;
    const remoteCommit = execa.shellSync(remoteCommitExec).stdout;

    if (localCommit === remoteCommit) {
      return false;
    }

    const lastCommonCommit = execa.shellSync(lastCommonCommitExec).stdout;

    if (lastCommonCommit === localCommit) {
      return true;
    }

    return false;
  } catch (e) {
    return false;
  }
};

export default gitNeedsPull;
