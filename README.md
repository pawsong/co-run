# co-run

Node core `exec()` wrapped to return a thunk for [co](https://github.com/visionmedia/co) with some `stdio` options.

[![NPM Version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]

```js
var co = require('co'),
    run = require('co-run');

co(function* () {
  yield run('echo "Hello World!"', {
    stdout: function (data) {
      console.log('stdout:', data);
    }
  });
});
```

## API

`[stdout, stderr] = yield run(cmd, options, execOptions)`

### cmd

Type: `String`

Shell command to execute.

### options.stdout

Type: `Writable Stream` or `Function`  
Default: `null`

child process's `stdout` handler.

If `Writable Stream` is given, it is piped to child process's `stdout`.  
If `Function` is given, it used as `data` event handler.

### options.stderr

Type: `Writable Stream` or `Function`  
Default: `null`

child process's `stderr` handler. 

If `Writable Stream` is given, it is piped to child process's `stderr`.  
If `Function` is given, it used as `data` event handler.

### options.stdin

Type: `Readable Stream`  
Default: `null`

Stream that is used as child process's `stdin`.  

### execOptions

Type: `Object`

Node core `exec()` [options](https://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback).

### [stdout, stderr]

Node core `exec()` [callback](https://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback) return value without error.

## Installation

```
$ npm install co-run
```

## License

  MIT

[npm-image]: https://img.shields.io/npm/v/co-run.svg
[npm-url]: https://npmjs.org/package/co-run
[travis-image]: https://travis-ci.org/gifff/co-run.svg?branch=master
[travis-url]: https://travis-ci.org/gifff/co-run
