export var then = (resolve) => resolve(function find(call, ...thisArg) {
  return (
    (this[Symbol.iterator]      && import("./sync.js").then((find) => find.call(this, call, ...thisArg))) ||
    (this[Symbol.asyncIterator] && import("./async.js").then((find) => find.call(this, call, ...thisArg))) ||
    (this.then && this.then((context) => console.log(context) || find.call(context, call, ...thisArg)))          ||
    Promise.resolve(this)
  )
});
