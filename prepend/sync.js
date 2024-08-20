export var then = (resolve) => resolve(function*append(...values) {
  yield*values;
  yield*this;
});
