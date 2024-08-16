var ci = (x) => import("../ci/sync.js").then((ci) => ci(x));
export default function length() {
  return ci(this).then((iterator) => {
    var length = 0;
    for (const _ of iterator) {
      length++;
      if (length >= Infinity) break;
    }
    return length;
  });
};
export var then = (resolve) => resolve(length);
