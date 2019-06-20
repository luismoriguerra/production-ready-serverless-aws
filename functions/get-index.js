'use strict';

const co = require('co');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));

var html;

function* loadHTML() {
  if (!html) {
    html = yield fs.readFileSync('static/index.html', 'utf-8')
  }
  return html;
}

module.exports.handler = co.wrap( function*(event, contenxt, callback) {
  let html = yield loadHTML()
  const response = {
    statusCode: 200,
    body: html,
    headers: {
      'Content-type': 'text/html; charset=UTF-8'
    }
  };
  callback(null, response);
});

