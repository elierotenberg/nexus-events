'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$defineProperty = require('babel-runtime/core-js/object/define-property')['default'];

var _Object$keys = require('babel-runtime/core-js/object/keys')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

_Object$defineProperty(exports, '__esModule', {
  value: true
});

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
      return _Object$keys(this._listeners);
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

    // up to 10 arguments
    value: function emit(ev, a, b, c, d, e, f, g, h, i) {
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

_Object$assign(EventEmitter.prototype, {
  on: addListener,
  off: removeListener,
  addHandler: addListener,
  removeHandler: removeListener,
  trigger: emit });

exports['default'] = { EventEmitter: EventEmitter };
module.exports = exports['default'];