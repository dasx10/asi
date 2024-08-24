export var then = (resolve) => resolve(function take(length) {
  return (
    (this[Symbol.iterator] && import("./sync.js").then((take) => take.call(this, length))) ||
    (this[Symbol.asyncIterator] && import("./async.js").then((take) => take.call(this, length))) ||
    (this.then && this.then((values) => take.call(values, length))) ||
    ({*[Symbol.iterator]() { if(length < 1) yield this; }})
  );
});
