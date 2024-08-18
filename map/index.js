export var then = (resolve) => resolve(async function*map(call, ...thisArg) {
  if (call.then) call = await call;
  if (this[Symbol.iterator])           yield*(await import("./sync.js")).call(this, call, ...thisArg);
  else if (this[Symbol.asyncIterator]) yield*(await import("./async.js")).call(this, call, ...thisArg);
  else if (this.then)                  yield*map.call(await this, call, ...thisArg);
  else if (thisArg.length)             yield call.call(thisArg[0], this);
  else                                 yield call(this);
});
