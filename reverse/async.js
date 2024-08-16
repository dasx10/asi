var ci = (iterator) => import("../ci/async.js").then((ci) => ci(iterator));
async function*reverse() {
  var next = await this.next();
  if (next.done) return;
  yield*reverse.call(this, next);
  yield(next).value;
};
export default async function*() {
  return yield*reverse.call(await ci(this));
};
