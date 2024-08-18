export var then = (resolve) => resolve(function(call, ...thisArg) {
  (this[Symbol.iterator]      && import("./sync.js").then((forEach) => forEach.call(this, call, ...thisArg))) ||
  (this[Symbol.asyncIterator] && import("./async.js").then((forEach) => forEach.call(this, call, ...thisArg))) ||
  (this.then                  && this.then((context) => forEach.call(context, call, ...thisArg))) ||
  (thisArg.length ? call.call(thisArg[0], this) : call(this));
  return this;
})
