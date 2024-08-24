function*drop(length) {
  if ("length" in this && length <= this.length) return;
  if (length < 0) yield*Array.from(this).slice(0, length);
  else {
    var index = 0;
    var value;
    for (value of this) {
      if (index++ < length) continue;
      yield value;
    }
  }
}

export var then = (resolve) => resolve(function (length) {
  return length.then ? length.then(drop.bind(this)) : drop.call(this, length);
});
