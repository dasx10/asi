function*step(next) {
  var index = 0;
  var value;
  for (value of this) if (index++ % next) yield value;
}
export var then = (resolve) => resolve(function (next) { return next.then ? next.then(step.bind(this)) : step.call(this, next) });
