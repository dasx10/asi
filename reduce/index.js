export var then = (resolve) => resolve(function reduce (call, ...thisArg) {
  return (this[Symbol.iterator] && import("./sync.js").then((reduce) => reduce.call(this, call, ...thisArg)))                  ||
    (this[Symbol.asyncIterator] && import("./async.js").then((reduce) => reduce.call(this, call, ...thisArg)))                 ||
    (this.then                  && this.then((context) => reduce.call(context, call, ...thisArg)))                      ||
    (thisArg.length > 1         && Promise.all(thisArg).then(({ 0: call, 1: thisArg }) => call(thisArg, this))) ||
    Promise.resolve(this)
  ;
});
