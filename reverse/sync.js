export var then = (resolve) => resolve(function reverse() {
  var values = Array.from(this);
  var length = values.length;
  while (length--) yield values[length];
  return this;
});
