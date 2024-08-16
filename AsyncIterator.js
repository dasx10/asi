var reducer = (sync, async) => function (...thisArg) {
  return (this[Symbol.iterator]      && import(sync).then((reduce) => reduce.apply(this, thisArg)))                  ||
         (this[Symbol.asyncIterator] && import(async).then((reduce) => reduce.apply(this, thisArg)))                 ||
         (this.then                  && this.then((context) => reduce.apply(context, thisArg)))                      ||
         (thisArg.length > 1         && Promise.all(thisArg).then(({ 0: call, 1: thisArg }) => call(thisArg, this))) ||
         Promise.resolve(this)
  ;
}
var reduce      = reducer("./reduce/sync.js", "./reduce/async.js");
var reduceRight = reducer("./reduceRight/sync.js", "./reduceRight/async.js");

function length () {
  return (this.length && Promise.resolve(this.length))                                                   ||
         (this.size && Promise.resolve(this.size))                                                       ||
         (this[Symbol.iterator] && import("./length/sync.js").then((length) => length.call(this)))       ||
         (this[Symbol.asyncIterator] && import("./length/async.js").then((length) => length.call(this))) ||
         (this.then && this.then((values) => length.call(values))) ||
         Promise.resolve(1)
  ;
}

function then (right, left) {
  return ((right || left) &&
         (this[Symbol.iterator] && right && import("./ci/sync.js").then((module) => Promise.all(module(this)).then(right, left))) ||
         (this[Symbol.asyncIterator] && right && import("./ci/async.js").then((module) => Array.fromAsync(module(this)).then(right, left))) ||
         (this.then && right && this.then((values) => then.call(values, right, left)))
  ) ||
    (left && (this instanceof Error) && Promise.resolve(left(this))) ||
    (right && Promise.resolve(right(this))) ||
         this
  ;
}

async function*map(call, ...thisArg) {
       if (call.then) call = await call;
       if (this[Symbol.iterator])      yield*(await import("./map/sync.js")).default.call(this, call, ...thisArg);
  else if (this[Symbol.asyncIterator]) yield*(await import("./map/async.js")).default.call(this, call, ...thisArg);
  else if (this.then)                  yield*map.call(await this, call, ...thisArg);
  else if (thisArg.length)             yield call.call(thisArg[0], this);
  else                                 yield call(this);
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
  static flyWeight = new WeakMap();
  constructor (value) {
    if (value && value.constructor === AI) return value;
    if (AI.flyWeight.has(value)) return AI.flyWeight.get(value);
    this.value = value;
    value === Object(value) && AI.flyWeight.set(value, this);
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
  map (call, ...thisArg) {
    return new AI(map.call(this.value, call, ...thisArg));
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
    return new AI(reduce.call(this.value, call, ...thisArg));
  }
  reduceRight (call, ...thisArg) {
    return new AI(reduceRight.call(this.value, call, ...thisArg));
  }
  get size () {
    return this.length;
  }
  get length () {
    return length.call(this.value);
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

new AI("123")
  .map(Number)
  .reverse()
// .reduce((x, y) => +x + y, 0)
  .then(console.log)
;

