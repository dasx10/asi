export var then = (resolve) => resolve(async function*take(length) {
  if (length < 0) yield*(await Array.fromAsync(this).then((values) => values.slice(length)));
  else {
    var index = 0;
    var value;
    for await (value of this) {
      if (index++ >= length) break;
      yield value;
    }
  }
});
