export var then = (resolve) => resolve(function (right, left) {
  return (this == null && Promise.resolve(this)) ||
         (this[Symbol.iterator] && Promise.all(this).then(right, left)) ||
         (this[Symbol.asyncIterator] && Array.fromAsync(this).then(right, left)) ||
         (this.then && this.then.constructor === Function && this.then((values) => then.call(values, right, left))) ||
         (this instanceof Error) && Promise.reject(this).catch(left) ||
         (Promise.resolve(this).then(right, left))
  ;
});
