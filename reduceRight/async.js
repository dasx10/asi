var def = (module) => module.default;
var reverse = import("../reverse/async.js").then(def);
var reduce  = import("../reduce/async.js").then(def);
export default function (call, ...thisArg) {
  return reverse.then((reverse) => reduce.then((reduce) => reduce.call(reverse.call(this), call, ...thisArg)));
}
