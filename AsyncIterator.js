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
    return new AI(load("./then/index.js").call(this, resolve, reject));
  }
  catch (reject) {
    return new AI(load("./then/index.js").call(this, null, reject));
  }
  finally (done) {
    var exec = () => done();
    load("./then/index.js").call(this, exec, exec);
    return this;
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
    return new AI(load("./reverse/index.js").call(this.value));
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
const a = new AI(test(5)).map(inc).map(inc).then(console.log);
setTimeout(() => {
  const b = new AI([10, 20]).map(inc).then(console.log);
}, 2000)
