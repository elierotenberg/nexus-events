"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

require("6to5/polyfill");
var _ = require("lodash");
var should = require("should");
var Promise = (global || window).Promise = require("bluebird");
var __DEV__ = process.env.NODE_ENV !== "production";
var __PROD__ = !__DEV__;
var __BROWSER__ = typeof window === "object";
var __NODE__ = !__BROWSER__;
if (__DEV__) {
  Promise.longStackTraces();
  Error.stackTraceLimit = Infinity;
}
var EventEmitter = (function () {
  var EventEmitter = function EventEmitter() {
    this._listeners = {};
    this._count = {};
  };

  _prototypeProperties(EventEmitter, null, {
    events: {
      get: function () {
        return Object.keys(this._listeners);
      },
      enumerable: true,
      configurable: true
    },
    countListeners: {
      value: function (ev) {
        if (__DEV__) {
          ev.should.be.a.String;
        }
        if (this._count[ev] === void 0) {
          return 0;
        }
        return this._count[ev];
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    emit: {
      value: function (ev, a, b, c, d, e, f, g, h, i) {
        // up to 10 arguments
        if (this._listeners[ev] !== void 0) {
          _.each(this._listeners[ev], function (fn) {
            return fn(a, b, c, d, e, f, g, h, i);
          });
        }
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    addListener: {
      value: function (ev, fn) {
        var _this = this;
        var lifespan = arguments[2] === undefined ? null : arguments[2];
        // if a lifespan is provided, chainable, else return a reference to the handle to be removed
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
            lifespan.should.have.property("onRelease").which.is.a.Function;
          }
          lifespan.onRelease(function () {
            return _this.removeListener(ev, ln);
          });
          return this;
        }
        return ln;
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    removeListener: {
      value: function (ev, ln) {
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
      },
      writable: true,
      enumerable: true,
      configurable: true
    }
  });

  return EventEmitter;
})();

var addListener = EventEmitter.prototype.addListener;
var removeListener = EventEmitter.prototype.removeListener;
var emit = EventEmitter.prototype.emit;
Object.assign(EventEmitter.prototype, {
  on: addListener,
  off: removeListener,
  trigger: emit });

module.exports = { EventEmitter: EventEmitter };