var then = (resolve) => resolve(async function*fulfilled() {
       if (this[Symbol.iterator])      yield*(await import("./sync.js")).default.call(this);
  else if (this[Symbol.asyncIterator]) yield*(await import("./async.js")).default.call(this);
  else if (this.then)                  yield*fulfilled.call(await this);
  else                                 yield this;
});
