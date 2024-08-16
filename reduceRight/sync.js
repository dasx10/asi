export default function reduceRight (call, ...thisArg) {
  return this.reduceRight
    ? this.reduceRight((create, value, index, values) => (create.then || value.then) ? Promise.all([create, value]).then(({ 0: create, 1: value }) => call(create, value, index, values)) : call(create, value, index, values), ...thisArg)
    : import("../reverse/sync.js").then((reverse) => import("../reduce/async.js").then((reduce) => reduce.call(reverse.call(this), call, ...thisArg)));
}
export var then = (resolve) => resolve(reduceRight);
