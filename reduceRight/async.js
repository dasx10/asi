export var then = (resolve) => resolve(function (call, ...thisArg) {
  return Promise.all([
    Array.fromAsync(this),
    call
  ]).then(({
    0: values,
    1: call
  }) => values.reduceRight(
    (create, value, index, values) => (create.then || value.then)
      ? Promise.all([create, value]).then(({ 0: create, 1: value }) => call(create, value, index, this, values))
      : call(create, value, index, this, values),
    ...thisArg)
  );
});
