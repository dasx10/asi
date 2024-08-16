export default async function*(call, thisArg) {
  var exec = thisArg ? call.bind(thisArg) : call;
  var index = 0;
  for (const value of await ci(this)) if (value && value.then) {
    const result = await value;
    if (exec(result, index++, this)) yield result;
  } else if (exec(value, index++, this)) yield value;
};
