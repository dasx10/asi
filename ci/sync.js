var cache = new WeakMap();
function*ci(iterator) {
  if (iterator.constructor === Iterator) {
    var i = cache.get(iterator);
    i?(yield*i):cache.set(iterator,i=[]);
    for (const value of iterator){i.push(value);yield value;}
  }
  else yield*iterator;
}
export const then = (resolve) => resolve(ci);
export default ci;
