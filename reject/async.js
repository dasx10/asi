export var then = (resolve) => resolve(async function*(call, thisArg) {
  var exec = thisArg ? call.bind(thisArg) : call;
  var index = 0;
  for await (const value of this) if (exec(value, index++, this)) continue; else yield value;
});
