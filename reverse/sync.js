var ci = (iterator) => import("../ci/sync.js").then((ci) => ci(iterator));
export default async function*reverse() {
  yield*(await ci(this).then((iterator) => Array.from(iterator).reverse()));
};
export var then = (resolve) => resolve(reverse);
