export var then = (resolve) => resolve(async function*append(...values) {
  yield*this;
  yield*values;
});
