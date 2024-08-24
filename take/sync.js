function*take(length) {
  if (length < 0) yield*Array.from(this).slice(length);
  else {
    var index = 0;
    var value;
    for (value of this) {
      if (index++ >= length) break;
      yield value;
    }
  }
}
export var then = (resolve) => resolve(function (length) {
  return length.then ? length.then(take.bind(this)) : take.call(this, length);
});
