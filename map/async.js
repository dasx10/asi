var ci = (iterator) => import("../ci/async.js").then((ci) => ci(iterator));

export default async function*(call, ...thisArg) {
  const exec = thisArg.length ? call.bind(thisArg[0]) : call;
  var index = 0;
  for await (const value of await ci(this)) yield exec(value, index++, this);
  return this;
}
