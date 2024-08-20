export var then = (resolve) => resolve(async function*append(...values) {
  yield*values;
  yield*this;
});
