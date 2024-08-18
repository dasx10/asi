export var then = (resolve) => resolve(function (right, left) {
  return ((this == null && Promise.resolve(this)) ||
    (right || left) &&
    (this[Symbol.iterator] && Promise.all(this).then(right, left)) ||
    (this[Symbol.asyncIterator] && Array.fromAsync(this).then(right, left)) ||
    (this.then && this.then((values) => then.call(values, right, left)))
  ) ||
    (left && (this instanceof Error) && Promise.resolve(left(this))) ||
    (right && Promise.resolve(right(this))) ||
    this
  ;
});
