export var then = (resolve) => resolve(async function concat(...values) {
  return (values.length)
    ? (
      (this[Symbol.iterator]         && import("./sync.js").then((concat) => concat.apply(this, values))) ||
      (this[Symbol.asyncIterator]    && import("./async.js").then((concat) => concat.apply(this, values))) ||
      (this.then && this.then((value) => concat.apply(value, values))) ||
      (concat.apply([this], values))
    )
    : this
  ;
});
