export default async function forEach (call, thisArg) {
  var exec = thisArg ? call.bind(thisArg) : call;
  var index = 0;
  for await (const value of await import("../ci/async.js").then((ci) => ci(this))) exec(value, index++, this);
  return this;
}
export var then = (resolve) => resolve(forEach);
