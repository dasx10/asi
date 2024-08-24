export var then = (resolve) => resolve(function step(value) {
  return (
    (this[Symbol.iterator] && import("./sync.js").then((step) => step.call(this, value))) ||
    (this[Symbol.asyncIterator] && import("./async.js").then((step) => step.call(this, value))) ||
    (this.then && this.then((values) => step.call(values, value))) ||
    ({*[Symbol.iterator]() { yield value; }})
  );
});
