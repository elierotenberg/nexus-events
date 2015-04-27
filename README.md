Nexus EventEmitter
==================

The canonical implementation of EventEmitter is nice, but is has two significant drawbacks:

- Event handlers are stored in Arrays. Removing a listener requires looping through the array to find the handlers to remove. This makes it unsuitable for frequently adding and removing a large number of event handlers.
- Event handlers are identified by comparing the references to the underlying function. It makes it very clumsy to use with anonymous functions (or arrow functions).

To correct these two drawbacks, here's my little Yet Another EventEmitter Implementation.

- Event handlers are stored in Objects, used as maps.
- Event handlers are referenced by a unique, short string key.
- Although using Objects as maps is slower than using Arrays, it is actually faster when the number of handlers is large. When its not, then the loss is most often negligible.
- Bonus: its an ES6 class. You can `extend` it (although to be honest you can also extend node `events`.EventEmitter).
- Bonus 2: if you use [`Lifespan`](https://github.com/elierotenberg/lifespan) then you can add a listener using a lifespan, it will be automatically removed when the lifespan is released.

#### Example

```js
const emitter = new EventEmitter();
let count = 0;
const ln = emitter.on('increase', (n) => count = count + (n || 1));
count.should.be.exactly(0);
emitter.trigger('increase');
count.should.be.exactly(1);
emitter.trigger('increase', 41);
count.should.be.exactly(42);
emitter.off('increase', ln);
emitter.trigger('increase', 100);
count.should.be.exactly(42);
let count2 = 1;
const lifespan = new Lifespan();
emitter.on('multiplyBy', (p) => count2 = count2 * p, lifespan);
count2.should.be.exactly(1);
emitter.trigger('multiplyBy', 2);
count2.should.be.exactly(2);
emitter.trigger('multiplyBy', 4);
count2.should.be.exactly(8);
lifespan.release();
emitter.trigger('multiplyBy', 2);
count2.should.be.exactly(8);
```
