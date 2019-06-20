'use strict';

const co = require('co');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const Mustache = require('mustache');
const http = require('superagent-promise')(require('superagent'), Promise);

const restaurantsApiRoot = process.env.restaurants_api;
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var html;

function* loadHTML() {
  if (!html) {
    html = yield fs.readFileAsync('static/index.html', 'utf-8')
  }
  return html;
}

function* getRestaurants() {
  return (yield http.get(restaurantsApiRoot)).body;
}

module.exports.handler = co.wrap( function*(event, contenxt, callback) {
  let template = yield loadHTML();
  let restaurants = yield getRestaurants();
  let dayOfWeek = days[new Date().getDay()];
  let html = Mustache.render(template, { dayOfWeek, restaurants });


  const response = {
    statusCode: 200, 
    body: html,
    headers: {
      'Content-type': 'text/html; charset=UTF-8'
    }
  };
  callback(null, response);
});

