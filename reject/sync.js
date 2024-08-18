export var then = (resolve) => resolve(async function*(call, thisArg) {
  var exec = thisArg ? call.bind(thisArg) : call;
  var index = 0;
  for (const value of this) if (value && value.then) {
    const result = await value;
    if (exec(result, index++, this)) continue;
    yield result;
  }
  else if (exec(value, index++, this)) continue;
  else yield value;
});
