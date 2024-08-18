import ci from "./ci/sync.js";
import load from "./load.js";

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
    return (resolve || reject)
      ? new AI(Promise.all([
        load("./then/index.js"),
        this.value,
        resolve,
        reject,
      ]).then(({ 0: then, 1: value, 2: resolve, 3: reject }) => then.call(value, resolve, reject)))
      : this
    ;
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
  reject (call, ...thisArg) {
    return new AI(load("./reject/index.js").call(this, call, ...thisArg));
  }
  reverse () {
    return new AI(load("./reverse/index.js").call(this));
  }
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
  for (var i = 0; i < x; i++) {
    await delay(100);
    yield await i;
  }
}

const inc = (x) => x + 1;

AI
  .from([1, 2, 3])
  .map(inc)
// .interval(250)
// .reduceRight((a, b) => a + b, 0)
  .then(Promise.resolve(console.log))
;
