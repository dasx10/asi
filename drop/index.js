export var then = (resolve) => resolve(function drop(length) {
  return (
    (this[Symbol.iterator] && import("./sync.js").then((drop) => drop.call(this, length))) ||
    (this[Symbol.asyncIterator] && import("./async.js").then((drop) => drop.call(this, length))) ||
    (this.then && this.then((values) => drop.call(values, length))) ||
    ({*[Symbol.iterator]() { if (length < 1) yield this; }})
  );
});
