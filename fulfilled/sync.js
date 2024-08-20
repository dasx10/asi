export var then = (resolve) => resolve(function*fulfilled() {
  return Promise.allSettled(this).then((values) => values.filter((settled) => settled.status === "fulfilled").map((settled) => settled.value));
});
