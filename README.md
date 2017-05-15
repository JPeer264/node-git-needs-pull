# git-needs-pull

Check synchronously if a git repository needs to push.

## Installation

```sh
$ npm i git-needs-pull --save
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
