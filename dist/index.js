'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, '__esModule', {
  value: true
});
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

var EventEmitter = (function () {
  function EventEmitter() {
    _classCallCheck(this, EventEmitter);

    this._listeners = {};
    this._count = {};
  }

  _createClass(EventEmitter, [{
    key: 'events',
    get: function () {
      return Object.keys(this._listeners);
    }
  }, {
    key: 'countListeners',
    value: function countListeners(ev) {
      if (__DEV__) {
        ev.should.be.a.String;
      }
      if (this._count[ev] === void 0) {
        return 0;
      }
      return this._count[ev];
    }
  }, {
    key: 'emit',
    value: function emit(ev, a, b, c, d, e, f, g, h, i) {
      // up to 10 arguments
      if (this._listeners[ev] !== void 0) {
        _.each(this._listeners[ev], function (fn) {
          return fn(a, b, c, d, e, f, g, h, i);
        });
      }
    }
  }, {
    key: 'addListener',

    // if a lifespan is provided, chainable, else return a reference to the handle to be removed
    value: function addListener(ev, fn) {
      var _this = this;

      var lifespan = arguments[2] === undefined ? null : arguments[2];

      if (__DEV__) {
        ev.should.be.a.String;
        fn.should.be.a.Function;
      }
      if (this._listeners[ev] === void 0) {
        this._listeners[ev] = {};
        this._count[ev] = 0;
      }
      var ln = _.uniqueId();
      this._listeners[ev][ln] = fn;
      this._count[ev] = this._count[ev] + 1;
      if (lifespan) {
        if (__DEV__) {
          lifespan.should.have.property('onRelease').which.is.a.Function;
        }
        lifespan.onRelease(function () {
          return _this.removeListener(ev, ln);
        });
        return this;
      }
      return ln;
    }
  }, {
    key: 'removeListener',
    value: function removeListener(ev, ln) {
      if (__DEV__) {
        ev.should.be.a.String;
        ln.should.be.a.String;
        this._listeners.should.have.property(ev).which.is.an.Object;
        this._listeners[ev].should.have.property(ln);
      }
      delete this._listeners[ev][ln];
      this._count[ev] = this._count[ev] - 1;
      if (this._count[ev] === 0) {
        delete this._listeners[ev];
        delete this._count[ev];
      }
    }
  }]);

  return EventEmitter;
})();

var _EventEmitter$prototype = EventEmitter.prototype;
var addListener = _EventEmitter$prototype.addListener;
var removeListener = _EventEmitter$prototype.removeListener;
var emit = _EventEmitter$prototype.emit;

Object.assign(EventEmitter.prototype, {
  on: addListener,
  off: removeListener,
  addHandler: addListener,
  removeHandler: removeListener,
  trigger: emit });

exports['default'] = { EventEmitter: EventEmitter };
module.exports = exports['default'];