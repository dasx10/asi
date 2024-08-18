export var then = (resolve) => resolve(function reverse() {
       if (this.toReverse)             return this.toReverse();
  else if (this[Symbol.iterator])      return Array.from(this).reverse();
  else if (this[Symbol.asyncIterator]) return Array.fromAsync(this).then((values) => values.reverse());
  else if (this.then)                  return this.then((values) => reverse.call(values));
  else                                 return [this];
});
