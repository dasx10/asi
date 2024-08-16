var ci = (iterator) => import("../ci/async.js").then((ci) => ci(iterator));
export default async function length () {
  return ci(this).then(async (iterator) => {
    var length = 0;
    for await (const _ of await ci(iterator)) {
      length++;
      if (length >= Infinity) break;
    }
    return length;
  });
};
export var then = (resolve) => resolve(length); 
