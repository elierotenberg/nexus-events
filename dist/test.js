'use strict';

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _EventEmitter = require('../');

var _Lifespan = require('lifespan');

var _Lifespan2 = _interopRequireDefault(_Lifespan);

require('babel/polyfill');
var _ = require('lodash');
var should = require('should');
var Promise = (global || window).Promise = require('bluebird');
var __DEV__ = process.env.NODE_ENV !== 'production';
var __PROD__ = !__DEV__;
var __BROWSER__ = typeof window === 'object';
var __NODE__ = !__BROWSER__;
if (__DEV__) {
  Promise.longStackTraces();
  Error.stackTraceLimit = Infinity;
}

var emitter = new _EventEmitter.EventEmitter();
var count = 0;
var ln = emitter.on('increase', function (n) {
  return count = count + (n || 1);
});
count.should.be.exactly(0);
emitter.trigger('increase');
count.should.be.exactly(1);
emitter.trigger('increase', 41);
count.should.be.exactly(42);
emitter.off('increase', ln);
emitter.trigger('increase', 100);
count.should.be.exactly(42);
var count2 = 1;
var lifespan = new _Lifespan2['default']();
emitter.on('multiplyBy', function (p) {
  return count2 = count2 * p;
}, lifespan);
count2.should.be.exactly(1);
emitter.trigger('multiplyBy', 2);
count2.should.be.exactly(2);
emitter.trigger('multiplyBy', 4);
count2.should.be.exactly(8);
lifespan.release();
emitter.trigger('multiplyBy', 2);
count2.should.be.exactly(8);