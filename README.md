# git-needs-pull

[![Build Status](https://travis-ci.com/JPeer264/node-git-needs-pull.svg?branch=master)](https://travis-ci.com/JPeer264/node-git-needs-pull)
[![Build status](https://ci.appveyor.com/api/projects/status/y3si9db1ynq9mlel/branch/master?svg=true)](https://ci.appveyor.com/project/JPeer264/node-git-needs-pull/branch/master)
[![Coverage Status](https://coveralls.io/repos/github/JPeer264/node-git-needs-pull/badge.svg?branch=master)](https://coveralls.io/github/JPeer264/node-git-needs-pull?branch=master)

Check synchronously if a git repository needs to pull.

## Installation

```sh
$ npm i git-needs-pull
```
or
```sh
$ yarn add git-needs-pull
```

## Usage

```js
const needsPull = require('git-needs-pull');

needsPull(); // true or false of process.cwd()
needsPull('any/git/repo'); // true or false
```

## LICENSE

MIT © [Jan Peer Stöcklmair](https://www.jpeer.at)
