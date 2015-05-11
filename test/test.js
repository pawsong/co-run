'use strict';

/* global describe, it */

var co = require('co'),
    run = require('../');

var expect = require('chai').expect;

var stream = require('stream'),
    Writable = stream.Writable,
    Readable = stream.Readable;

var catchErr = function* (thunk) {
  try { yield thunk; }
  catch(e) { return e; }
  return null;
};

describe('co-run', function () {

  it('should raise error when cmd is not a string', function (done) {

    co(function* () {

      var err = yield catchErr(run());
      expect(err).to.have.property('message',
                                   'cmd must be a string');
    }).then(done, done);

  });

  it('should return correct status code', function (done) {

    co(function* () {

      var err;

      err = yield catchErr(run('./exit1.sh', {
        stdin: false,
      }, {
        cwd: __dirname + '/fixtures'
      }));

      expect(err).to.have.property('code', 1);

      err = yield catchErr(run('./exit255.sh', {
        stdin: false,
      }, {
        cwd: __dirname + '/fixtures'
      }));

      expect(err).to.have.property('code', 255);

    }).then(done, done);

  });

  it('should use callback to handle stdout and stderr', function (done) {

    co(function* () {

      var message = 'hello\nworld\n';

      var result, ret;

      // stdout
      result = '';
      ret = yield run('./stdout.sh', {
        stdin: false,
        stdout: function (data) {
          result += data;
        }
      }, {
        cwd: __dirname + '/fixtures'
      });

      expect(ret).to.have.property(0, message);
      expect(ret).to.have.property(1, '');

      expect(result).to.equal(message);

      // stderr
      result = '';
      ret = yield run('./stderr.sh', {
        stdin: false,
        stderr: function (data) {
          result += data;
        }
      }, {
        cwd: __dirname + '/fixtures'
      });

      expect(ret).to.have.property(0, '');
      expect(ret).to.have.property(1, message);

      expect(result).to.equal(message);

    }).then(done, done);

  });

  it('should use stream to handle stdout and stderr', function (done) {

    co(function* () {

      var message = 'hello\nworld\n';

      var result, ret;

      function createWriteStream () {
        var ws = new Writable();
        ws._write = function (chunk, enc, next) {
          result += chunk;
          next();
        };
        return ws;
      }

      // stdout
      result = '';

      ret = yield run('./stdout.sh', {
        stdin: false,
        stdout: createWriteStream()
      }, {
        cwd: __dirname + '/fixtures'
      });

      expect(ret).to.have.property(0, message);
      expect(ret).to.have.property(1, '');

      expect(result).to.equal(message);

      // stderr
      result = '';
      ret = yield run('./stderr.sh', {
        stdin: false,
        stderr: createWriteStream()
      }, {
        cwd: __dirname + '/fixtures'
      });

      expect(ret).to.have.property(0, '');
      expect(ret).to.have.property(1, message);

      expect(result).to.equal(message);

    }).then(done, done);

  });

  it('should get input data from stdin', function (done) {

    co(function* () {

      var message = 'hello\nworld\n';

      var result, ret;

      function createReadStream () {
        var rs = new Readable();
        rs.push('hello\n');
        rs.push('world\n');
        rs.push(null);

        return rs;
      }

      // custom readable stream
      result = '';

      ret = yield run('./stdin.sh', {
        stdin: createReadStream(),
        stdout: function (data) {
          result += data;
        }
      }, {
        cwd: __dirname + '/fixtures'
      });

      expect(ret).to.have.property(0, message);
      expect(ret).to.have.property(1, '');

      expect(result).to.equal(message);

      // process.stdin
      result = '';

      process.stdin.push('hello\n');
      process.stdin.push('world\n');
      process.stdin.push(null);

      ret = yield run('./stdin.sh', {
        stdout: function (data) {
          result += data;
        },
        stdin: process.stdin
      }, {
        cwd: __dirname + '/fixtures'
      });

      expect(ret).to.have.property(0, message);
      expect(ret).to.have.property(1, '');

      expect(result).to.equal(message);

    }).then(done, done);

  });

});
