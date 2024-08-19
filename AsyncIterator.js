import ci from "./ci/sync.js";
import load from "./load.js";

var reverse = function () {
  return new AI(load("./reverse/index.js").call(this.value));
};

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


class AI {
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
    return new AI(load("./interval/index.js").call(this, timeMs));
  }
  addInterval(timeMs) {
    return new AI(load("./addInterval/index.js").call(this, timeMs));
  }
  forEach (call, ...thisArg) {
    load("./forEach/index.js").call(this, call, ...thisArg);
    return this;
  }
  map (call, ...thisArg) {
    return new AI(load("./map/index.js").call(this, call, ...thisArg));
  }
  filter (call, ...thisArg) {
    return new AI(load("./filter/index.js").call(this, call, ...thisArg));
  }
  find (call, ...thisArg) {
    return new AI(load("./find/index.js").call(this, call, ...thisArg));
  }
  reject (call, ...thisArg) {
    return new AI(load("./reject/index.js").call(this, call, ...thisArg));
  }

  reverse   = reverse;
  toReverse = reverse;

  reduce (call, ...thisArg) {
    return new AI(load("./reduce/index.js").call(this, call, ...thisArg));
  }
  reduceRight (call, ...thisArg) {
    return new AI(load("./reduceRight/index.js").call(this, call, ...thisArg));
  }
  get length () {
    return load("./length/index.js").call(this.value);
  }
  get size () {
    return this.length;
  }
  get fulfilled () {
    return new AI(load("./fulfilled/index.js").call(this));
  }

  async*[Symbol.asyncIterator] () {
         if (this.value[Symbol.iterator])      yield*(await import("./ci/sync.js"))(this.value);
    else if (this.value[Symbol.asyncIterator]) yield*(await import("./ci/async.js"))(this.value);
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

const inc = Promise.resolve((x) => Promise.resolve(x + 1));
const gt = Promise.resolve((x) => Promise.resolve(x > 1));

AI
  .from(test(4))
  .filter(gt)
  .filter(gt)
  .map(inc)
  .map(inc)
  .map(inc)
  .map(inc)
  .then(console.log)
;
