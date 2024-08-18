export var then = (resolve) => resolve(async function*reject(call, ...thisArg) {
  if (this[Symbol.iterator])           yield*(await import("./sync.js")).default.call(this, call, ...thisArg);
  else if (this[Symbol.asyncIterator]) yield*(await import("./async.js")).default.call(this, call, ...thisArg);
  else if (this.then)                  yield*reject.call(await this, call, ...thisArg);
  else if (thisArg ? call.call(thisArg[0], this) : call(this)) yield this;
});
