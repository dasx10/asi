import ci from "./ci/sync.js";

var then = (() => {
  var resolver = (right) => right
    ? (values) => right.then
      ? right.then((right) => right(values))
      : right(values)
    : (values) => values
  ;

  var rejecter = (left) => left
    ? (error) => left.then
      ? left.then(
        (left) => left(error),
        (is) => is && is.constructor === Function ? Promise.resolve(is(error)).then((next) => Promise.reject(next)) : Promise.reject(error)
      )
      : left(error)
    : (error) => Promise.reject(error)
  ;

  return function then(right, left) {
    return (
      (this == null               && Promise.resolve(this).then(resolver(right), rejecter(left)))                      ||
      (this[Symbol.iterator]      && Promise.all(this).then(resolver(right), rejecter(left)))                          ||
      (this[Symbol.asyncIterator] && Array.fromAsync(this).then(resolver(right), rejecter(left)))                      ||
      (this.then                  && Promise.resolve(this).then((values) => then.call(values, right), rejecter(left))) ||
      ((this instanceof Error)    && (Promise.reject(this).catch(rejecter(left))))                                     ||
      (Promise.resolve(this).then(resolver(right), rejecter(left)))
    );
  };
})();


var emptyIterator = (function*(){})()
class AI {
  static get empty () {
    return new AI(emptyIterator);
  }

  static range(start, end = 0, step = 1, additional = start < end) {
    return new AI({*[Symbol.iterator](){
      var index = start;
      if (additional) while(index <= end) {
        yield index;
        index += step;
      }
      else while(index >= end) {
        yield index;
        index -= step;
      }
    }});
  }

  static from (value) {
    return new AI(value);
  }

  static of (...values) {
    return new AI(values);
  }

  static flyWeight = new WeakMap();
  constructor (value) {
    if (value && value.constructor === AI) return value;
    if (AI.flyWeight.has(value)) return AI.flyWeight.get(value);
    if (value != null) {
      this.value = value
      value === Object(value) && AI.flyWeight.set(value, this);
    }
  }
  get [Symbol.iterator]() {
    return Symbol.iterator in this.value
      ? function*(){yield*ci(this.value)}
      : null
    ;
  }
  then (resolve, reject) {
    return ((resolve || reject)
      ? new AI(then.call(this.value, resolve, reject))
      : this
    );
  }
  catch (reject) {
    return this.then(null, reject);
  }
  finally (done) {
    var exec = () => done();
    this.then(exec, exec);
    return this;
  }
  interval(timeMs) {
    return new AI(import("./interval/index.js").then((interval) => interval.call(this, timeMs)));
  }
  addInterval(timeMs) {
    return new AI(import("./addInterval/index.js").then((addInterval) => addInterval.call(this, timeMs)));
  }
  forEach (call, ...thisArg) {
    import("./forEach/sync.js").then((forEach) => forEach.call(this, call, ...thisArg));
    return this;
  }
  map (call, ...thisArg) {
    return new AI(import("./map/index.js").then((map) => map.call(this, call, ...thisArg)));
  }
  filter (call, ...thisArg) {
    return new AI(import("./filter/index.js").then((filter) => filter.call(this, call, ...thisArg)));
  }
  find (call, ...thisArg) {
    return new AI(import("./find/index.js").then((find) => find.call(this, call, ...thisArg)));
  }
  reject (call, ...thisArg) {
    return new AI(import("./reject/index.js").then((reject) => reject.call(this, call, ...thisArg)));
  }
  reverse () {
    return new AI(import("./reverse/index.js").then((reverse) => reverse.call(this.value)));
  }
  toReverse () {
    return new AI(import("./reverse/index.js").then((toReverse) => toReverse.call(this.value)));
  }
  reduce (call, ...thisArg) {
    return new AI(import("./reduce/index.js").then((reduce) => reduce.call(this, call, ...thisArg)));
  }
  reduceRight (call, ...thisArg) {
    return new AI(import("./reduceRight/index.js").then((reduceRight) => reduceRight.call(this, call, ...thisArg)));
  }
  concat (...values) {
    return values.length
      ? new AI(import("./concat/index.js").then((concat) => concat.call(this.value, ...values)))
      : this
    ;
  }
  concatRight (...values) {
    return values.length
      ? this.concat.apply(AI.empty, values.concat(this))
      : this;
  }
  append (...values) {
    return values.length
      ? new AI(import("./append/index.js").then((append) => append.call(this.value, ...values)))
      : this
    ;
  }
  prepend (...values) {
    return values.length
      ? new AI(import("./prepend/index.js").then((prepend) => prepend.call(this.value, ...values)))
      : this;
  }
  get length () {
    return import("./length/index.js").then((length) => length.call(this.value));
  }
  get size () {
    return this.length;
  }
  get fulfilled () {
    return new AI(import("./fulfilled/index.js").then((fulfilled) => fulfilled.call(this.value)));
  }
  get settled () {
    return new AI(import("./settled/index.js").then((settled) => settled.call(this.value)));
  }
  async*[Symbol.asyncIterator] () {
         if (this.value == null)               yield this.value;
    else if (this.value[Symbol.iterator])      yield*ci(this.value);
    else if (this.value[Symbol.asyncIterator]) yield*(await import("./ci/async.js").then((ci) => ci(this.value)));
    else if (this.value.then)                  yield*new AI(await this.value);
    else                                       yield this.value;
  }
}

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
async function*test(x) {
  for (var i = 0; i <= x; i++) {
    await delay(100);
    yield await i;
  }
}

var readFile = import("fs/promises").then((({ readFile }) => (path) => readFile(path, "utf8")));
AI
  .from(["./index.js", "./Promise.js"])
  .map(readFile)
  .settled
  .then(console.log)
