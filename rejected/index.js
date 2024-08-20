export var then = (resolve) => resolve(function fulfilled() {
  return (
    (this[Symbol.iterator]      && import("./sync.js").then((fulfilled) => fulfilled.call(this))) ||
    (this[Symbol.asyncIterator] && import("./async.js").then((fulfilled) => fulfilled.call(this))) ||
    (this.then && this.then((value) => fulfilled.call(value))) ||
    (fulfilled.call(this))
  )
});
