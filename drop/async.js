async function*drop(length) {
  if (length < 0) yield*(await Array.fromAsync(this).then((values) => values.slice(0, length)));
  else {
    var index = 0;
    var value;
    length = length.then ? await length : length;
    for await (value of this) {
      if (index++ < length) continue;
      yield value;
    }
  }
}

export var then = (resolve) => resolve(function (length) {
  return length.then ? length.then(drop.bind(this)) : drop.call(this, length);
});
