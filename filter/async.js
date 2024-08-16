var module = import("../ci/async.js").then((module) => module.default);
var ci = (iterator) => module.then((ci) => ci(iterator));
export default async function*(call, thisArg) {
  var exec = thisArg ? call.bind(thisArg) : call;
  var index = 0;
  for await (const value of await ci(this)) if (exec(value, index++, this)) yield value;
};
