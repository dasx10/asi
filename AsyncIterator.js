import ci from "./ci/sync.js";
var modules = new Map();
var loads = new Map();
var load = (path) => function (...args) {
  return modules.has(path)
    ? modules.get(path).call(this, ...args)
    : loads.has(path)
      ? loads.get(path).then((module) => module.call(this, ...args))
      : loads.set(path, import(path).then((module) => (loads.delete(path), modules.set(path, module), module))).get(path).then((module) => module.call(this, ...args))
};

function then (right, left) {
  return (
    (this == null && Promise.resolve(this)) ||
    (right || left) &&
         (this[Symbol.iterator] && right && import("./ci/sync.js").then((module) => Promise.all(module(this)).then(right, left))) ||
         (this[Symbol.asyncIterator] && right && import("./ci/async.js").then((module) => Array.fromAsync(module(this)).then(right, left))) ||
         (this.then && right && this.then((values) => then.call(values, right, left)))
  ) ||
    (left && (this instanceof Error) && Promise.resolve(left(this))) ||
    (right && Promise.resolve(right(this))) ||
         this
  ;
}
async function*filter(call, ...thisArg) {
       if (this[Symbol.iterator])      yield*(await import("./filter/sync.js")).default.call(this, call, ...thisArg);
  else if (this[Symbol.asyncIterator]) yield*(await import("./filter/async.js")).default.call(this, call, ...thisArg);
  else if (this.then)                  yield*filter.call(await this, call, ...thisArg);
  else if (thisArg ? call.call(thisArg[0], this) : call(this)) yield this;
}
async function*reject(call, ...thisArg) {
       if (this[Symbol.iterator])      yield*(await import("./reject/sync.js")).default.call(this, call, ...thisArg);
  else if (this[Symbol.asyncIterator]) yield*(await import("./reject/async.js")).default.call(this, call, ...thisArg);
  else if (this.then)                  yield*reject.call(await this, call, ...thisArg);
  else if (thisArg ? call.call(thisArg[0], this) : call(this)) yield this;
}
async function*reverse() {
  if (this[Symbol.iterator])           yield*(await import("./reverse/sync.js")).default.call(this);
  else if (this[Symbol.asyncIterator]) yield*(await import("./reverse/async.js")).default.call(this);
  else if (this.then)                  yield*reverse.call(await this);
  else                                 yield this;
}
async function*fulfilled() {
       if (this[Symbol.iterator])      yield*(await import("./fulfilled/sync.js")).default.call(this);
  else if (this[Symbol.asyncIterator]) yield*(await import("./fulfilled/async.js")).default.call(this);
  else if (this.then)                  yield*fulfilled.call(await this);
  else                                 yield this;
}

class AI {
  static from (value) {
    return new AI(value);
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
    return new AI(then.call(this.value, resolve, reject));
  }
  catch (reject) {
    return new AI(then.call(this.value, null, reject));
  }
  finally (done) {
    var exec = () => done();
    then.call(this, exec, exec);
    return this;
  }
  forEach (call, ...thisArg) {
    (this[Symbol.iterator]      && import("./forEach/sync.js").then((forEach) => forEach.call(this, call, ...thisArg))) ||
    (this[Symbol.asyncIterator] && import("./forEach/async.js").then((forEach) => forEach.call(this, call, ...thisArg))) ||
    (this.then                  && this.then((context) => forEach.call(context, call, ...thisArg))) ||
    (thisArg.length ? call.call(thisArg[0], this) : call(this));
    return this;
  }
  map (call, ...thisArg) {
    return new AI(load("./map/index.js").call(this, call, ...thisArg));
  }
  filter (call, ...thisArg) {
    return new AI(filter.call(this.value, call, ...thisArg));
  }
  reject (call, ...thisArg) {
    return new AI(reject.call(this.value, call, ...thisArg));
  }
  reverse () {
    return new AI(reverse.call(this.value));
  }
  reduce (call, ...thisArg) {
    return new AI(import("./reduce/index.js").then((reduce) => reduce.call(this, call, ...thisArg)));
  }
  reduceRight (call, ...thisArg) {
    return new AI(import("./reduceRight/index.js").then((reduceRight) => reduceRight.call(this, call, ...thisArg)));
  }
  get length () {
    return load("./length/index.js").call(this.value);
  }
  get size () {
    return this.length;
  }
  get fulfilled () {
    return new AI(fulfilled.call(this.value));
  }

  async*[Symbol.asyncIterator] () {
    if (this.value[Symbol.iterator])           yield*(await import("./ci/sync.js"))(this.value);
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
const a = new AI([1, 2]).map(inc).then(console.log);
setTimeout(() => {
  const b = new AI([10, 20]).map(inc).then(console.log);
}, 2000)
