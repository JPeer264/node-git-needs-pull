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
    if (platform() === 'win32') {
      execa.shellSync(`pushd ${thisPath} & git pull ${r} ${b} --dry-run --no-verify`);
    } else {
      const localCommit = execa.shellSync(`(cd ${thisPath} ; git rev-parse "@")`).stdout;
      const remoteCommit = execa.shellSync(`(cd ${thisPath} ; git rev-parse ${r}/${b})`).stdout;

      if (localCommit === remoteCommit) {
        return false;
      }

      const lastCommonCommit = execa.shellSync(`(cd ${thisPath} ; git merge-base "@" ${r}/${b})`).stdout;

      if (lastCommonCommit === localCommit) {
        return true;
      }
    }

    return false;
  } catch (e) {
    return false;
  }
};

export default gitNeedsPull;
