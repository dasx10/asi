export var then = (resolve) => resolve(function prepend(...values) {
  return (
    (this[Symbol.iterator]      && import("./sync.js").then((prepend) => prepend.apply(this, values))) ||
    (this[Symbol.asyncIterator] && import("./async.js").then((prepend) => prepend.apply(this, values))) ||
    (this.then && this.then((value) => prepend.apply(value, values))) ||
    (prepend.apply([this], values))
  );
});
