export var then = (resolve) => import("../load.js").then((load) => (function map(call, ...thisArg) {
  return (this[Symbol.iterator]      && load("./map/sync.js").call(this, call, ...thisArg)) ||
         (this[Symbol.asyncIterator] && load("./map/async.js").call(this, call, ...thisArg)) ||
         (this.then && this.then((values) => map.call(values, call, ...thisArg))) ||
         ({*[Symbol.iterator]() {
           yield thisArg.length ? call.call(thisArg[0], this) : call(this);
         }})
})).then(resolve);
