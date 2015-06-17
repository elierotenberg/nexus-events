import { EventEmitter } from '../';
import Lifespan from 'lifespan';
import 'should';
const { describe, it } = global;

describe('EventEmitter', () => {
  // Stub tests. Will refactor later.
  it('should not throw', () => {
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
  });
});
