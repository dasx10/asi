export var then = (resolve) => resolve(async function*slice(start = 0, end = Infinity, step = 1) {
  if (end < 0 || start < 0) yield*Array.fromAsync(this).then((values) => values.slice(start, end));
  else {
    var index = 0;
    var value;
    for await (value of this) {
      if (index++ < start) continue;
      if (index > end) break;
      yield value;
    }
  }
});
