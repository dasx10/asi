export var then = (resolve) => import("../load.js").then((load) => function find(call, ...thisArg) {
  return (
    (this[Symbol.iterator]      && load("./find/sync.js").call(this, call, ...thisArg))  ||
    (this[Symbol.asyncIterator] && load("./find/async.js").call(this, call, ...thisArg)) ||
    (this.then && this.then((context) => find.call(context, call, ...thisArg)))          ||
    Promise.resolve(this)
  )
}).then(resolve);
