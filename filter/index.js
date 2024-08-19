export var then = (resolve) => resolve(function filter(call, ...thisArgs) {
  return (
    (this[Symbol.iterator]      && import("./sync.js").then((filter) => filter.call(this, call, ...thisArgs)))  ||
    (this[Symbol.asyncIterator] && import("./async.js").then((filter) => filter.call(this, call, ...thisArgs))) ||
    (this.then && this.then((values) => filter.call(values, call, ...thisArgs)))                                ||
    (Promise.resolve(thisArgs.length ? call.call(thisArgs[0], this) : call(this)).then((status) => status ? this : []))
  );
});
