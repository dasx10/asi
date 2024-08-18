export var then = (resolve) => resolve(function reduceRight(call, ...thisArg) {
  return Array.from(this).reduceRight((create, value, index) => (create.then || value.then)
    ? Promise.all([create, value]).then(({ 0: create, 1: value }) => call(create, value, index, this))
    : call(create, value, index, this)
    , ...thisArg
  )
});
