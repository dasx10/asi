var cache      = new WeakMap();
var fullfilled = new WeakMap();
async function*ci(iterator) {
  const iterable = iterator[Symbol.asyncIterator]();
  if (iterator === iterable) {
    if (fullfilled.has(iterator)) yield*fullfilled.get(iterator);
    var i = cache.get(iterator) || cache.set(iterator, []).get(iterator);
    var index = 0;
    while (true) {
      while (index < i.length) {
        const { done, value } = await i[index++];
        if (done) break;
        else yield value;
      }
      const promise = iterable.next();
      i.push(promise);
      const { done, value } = await promise;
      i[i.findLastIndex((next) => next === promise)] = { done, value };
      if (done) {
        Promise.all(i).then((values) => fullfilled.set(iterator, values.map(({ value }) => value)));
        return value;
      }
    }
  }
  else yield*iterable;
};
export const then = (resolve) => resolve(ci);
