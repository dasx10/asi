async function trusy () {
  var value;
  for (value of this) if (await value) return value;
};

var nonce = Promise.resolve(undefined);

export var then = (resolve) => resolve(function (call, ...thisArgs) {
  var test = thisArgs.length ? call.bind(thisArgs[0]) : call;
  var index = 0;
  var expected = new Array(0);
  var value, promise;
  for (value of this) {
    promise = (value && value.then)
      ? Promise.all([value, index++]).then(({ 0: value, 1: index }) => test(value, index++, this))
      : test(value, index++, this)
    ;
    if (promise) {
      if (promise.then || expected.length) expected.push(promise.then((status) => status && value));
      else return value;
    }
  }

  return expected.length
    ? trusy.call(expected)
    : nonce
  ;
});
