export var then = (resolve) => resolve(function length() {
  return (this.length && Promise.resolve(this.length))                                                   ||
         (this.size   && Promise.resolve(this.size))                                                       ||
         (this[Symbol.iterator] && import("./sync.js").then((length) => length.call(this)))       ||
         (this[Symbol.asyncIterator] && import("./async.js").then((length) => length.call(this))) ||
         (this.then && this.then((values) => length.call(values))) ||
         Promise.resolve(1)
  ;
});
