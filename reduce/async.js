export default async function reduce (call, ...thisArg) {
  var iterable = this[Symbol.asyncIterator]();
  var create = thisArg.length ? thisArg[0] : (await iterable.next()).value;
  var index = 0;
  for await (const value of iterable) create = call(await create, value, index++, this);
  return create;
};
export var then = (resolve) => resolve(reduce);
