export var then = (resolve) => resolve(function fulfilled() {
  return Promise.allSettled(this).then((values) => values.filter((settled) => settled.status === "rejected").map((settled) => settled.reason));
});
