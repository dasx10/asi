async function trusy () {
  var value;
  for (value of this) if (await value) return value;
};
var nonce = Promise.resolve(undefined);

export var then = (resolve) => resolve(async function find(call, ...thisArgs) {
  var index = 0;
  var test = thisArgs.length ? call.bind(thisArgs[0]) : call;
  var value, promise;
  var expected = new Array(0);
  for await (value of this) {
    promise = test(value, index++, this);
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
