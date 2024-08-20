export var then = (resolve) => resolve(function settled() {
  return (
    (this[Symbol.iterator]      && Promise.allSettled(this))                        ||
    (this[Symbol.asyncIterator] && import("./async.js").then((settled) => settled.call(this))) ||
    (this.then && this.then((value) => settled.call(value))) ||
    (settled.call(this))
  )
});
