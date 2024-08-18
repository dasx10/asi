export var then = (resolve) => resolve(async function*reverse() {
       if (this.toReverse)             yield*this.toReverse();
  else if (this[Symbol.iterator])      yield*(await import("./sync.js")).call(this);
  else if (this[Symbol.asyncIterator]) yield*(await import("./async.js")).call(this);
  else if (this.then)                  yield*reverse.call(await this);
  else                                 yield this;
});
