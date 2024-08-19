export var then = (resolve) => resolve(function(call, ...thisArg) {
  return (
    (this[Symbol.iterator]      && import("./sync.js").then((map) => map.call(this, call, ...thisArg)))  ||
    (this[Symbol.asyncIterator] && import("./async.js").then((map) => map.call(this, call, ...thisArg))) ||
    (this.then && this.then((values) => map.call(values, call, ...thisArg))) ||
    ({*[Symbol.iterator]() { yield thisArg.length ? call.call(thisArg[0], this) : call(this); }})
  );
});
