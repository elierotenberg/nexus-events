class EventEmitter {
  constructor() {
    this._listeners = {};
    this._count = {};
  }

  get events() {
    return Object.keys(this._listeners);
  }

  countListeners(ev) {
    if(__DEV__) {
      ev.should.be.a.String;
    }
    if(this._count[ev] === void 0) {
      return 0;
    }
    return this._count[ev];
  }

  // up to 10 arguments
  emit(ev, a, b, c, d, e, f, g, h, i) {
    if(this._listeners[ev] !== void 0) {
      _.each(this._listeners[ev], (fn) => fn(a, b, c, d, e, f, g, h, i));
    }
  }

  // if a lifespan is provided, chainable, else return a reference to the handle to be removed
  addListener(ev, fn, lifespan = null) {
    if(__DEV__) {
      ev.should.be.a.String;
      fn.should.be.a.Function;
    }
    if(this._listeners[ev] === void 0) {
      this._listeners[ev] = {};
      this._count[ev] = 0;
    }
    const ln = _.uniqueId();
    this._listeners[ev][ln] = fn;
    this._count[ev] = this._count[ev] + 1;
    if(lifespan) {
      if(__DEV__) {
        lifespan.should.have.property('onRelease').which.is.a.Function;
      }
      lifespan.onRelease(() => this.removeListener(ev, ln));
      return this;
    }
    return ln;
  }

  removeListener(ev, ln) {
    if(__DEV__) {
      ev.should.be.a.String;
      ln.should.be.a.String;
      this._listeners.should.have.property(ev).which.is.an.Object;
      this._listeners[ev].should.have.property(ln);
    }
    delete this._listeners[ev][ln];
    this._count[ev] = this._count[ev] - 1;
    if(this._count[ev] === 0) {
      delete this._listeners[ev];
      delete this._count[ev];
    }
  }
}

const { addListener, removeListener, emit } = EventEmitter.prototype;
Object.assign(EventEmitter.prototype, {
  on: addListener,
  off: removeListener,
  addHandler: addListener,
  removeHandler: removeListener,
  trigger: emit,
});

export default { EventEmitter };
