var resolver = (right) => right
  ? (values) => right.then
    ? right.then((right) => right(values))
    : right(values)
  : (values) => values
;

var rejecter = (left) => left
  ? (error) => left.then
    ? left.then(
      (left) => left(error),
      (is) => is && is.constructor === Function ? Promise.resolve(is(error)).then((next) => Promise.reject(next)) : Promise.reject(error)
    )
    : left(error)
  : (error) => Promise.reject(error)
;

export var then = (resolve) => resolve(function (right, left) {
  return (
    (this == null               && Promise.resolve(this).then(resolver(right), rejecter(left)))                     ||
    (this[Symbol.iterator]      && Promise.all(this).then(resolver(right), rejecter(left)))                         ||
    (this[Symbol.asyncIterator] && Array.fromAsync(this).then(resolver(right), rejecter(left)))                ||
    (this.then                  && this.then((values) => then.call(values, right, left))) ||
    ((this instanceof Error)    && (Promise.reject(this).catch(rejecter(left)))) ||
    (Promise.resolve(this).then(resolver(right), rejecter(left)))
  );
});
