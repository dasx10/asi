var cache = new WeakMap();
async function*clone(iterator) {
  var i = cache.get(iterator) || cache.set(iterator, []).get(iterator);
  var index = 0;
  while (true) {
    while (index < i.length) {
      var { done, value } = await i[index++];
      if (done) break;
      else yield value;
    }
    var promise = iterable.next();
    i.push(promise);
    var { done, value } = await promise;
    i[i.findLastIndex((next) => next === promise)] = { done, value };
    if (done) return value;
  }
}
function ci(iterator) {
  var iterable = iterator[Symbol.asyncIterator]();
  return (iterator === iterable) ? clone(iterator) : iterable;
};
export var then = (resolve) => resolve(ci);
