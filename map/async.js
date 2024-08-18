export var then = (resolve) => resolve(async function*map(call, ...thisArg) {
  const exec = thisArg.length ? call.bind(thisArg[0]) : call;
  var index = 0;
  for await (const value of this) yield exec(value, index++, this);
  return this;
});
