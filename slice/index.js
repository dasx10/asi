export var then = (resolve) => resolve(function slice(...indexes) {
  return (
    (this[Symbol.iterator]      && import("./sync.js").then((slice) => slice.call(this, ...indexes))) ||
    (this[Symbol.asyncIterator] && import("./async.js").then((slice) => slice.call(this, ...indexes))) ||
    (this.then && this.then((values) => slice.call(values, ...indexes))) ||
    ({ *[Symbol.iterator]() { if(!indexes[0]) yield this; } })
  );
});
