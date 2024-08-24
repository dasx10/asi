function*slice(start = 0, end = Infinity) {
  if (end < 0 || start < 0) yield*Array.from(this).slice(start, end);
  else {
    var index = 0;
    var value;
    for (value of this) {
      if (index++ < start) continue;
      if (index > end) break;
      yield value;
    }
  }
}
export var then = (resolve) => resolve(function (start, end) {
  return (start && start.then) || (end && end.then)
    ? Promise.all([start, end]).then((values) => slice.call(this, values[0], values[1]))
    : slice.call(this, start, end)
  ;
});
