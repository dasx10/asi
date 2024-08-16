function each (call, ...thisArg) {
  var exec = thisArg.length ? call.bind(thisArg[0]) : call;
  var index = 0;
  for (const value of this) exec(value, index++, this);
  return this;
}
export default function forEach (call, ...thisArg) {
  return this.forEach
    ? (this.forEach((value, index, values) => value && value.then ? value.then((value) => call(value, index, values)) : call(value, index, values)), this)
    : import("../ci/sync.js").then((ci) => each.call(ci(this), call, ...thisArg))
  ;
}
export var then = (resolve) => resolve(forEach);
