export var then = (resolve) => resolve(function append(...values) {
  return (
    (this[Symbol.iterator]      && import("./sync.js").then((append) => append.apply(this, values))) ||
    (this[Symbol.asyncIterator] && import("./async.js").then((append) => append.apply(this, values))) ||
    (this.then && this.then((value) => append.apply(value, values))) ||
    (append.apply([this], values))
  );
});
