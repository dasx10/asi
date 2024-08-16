var module = import("../ci/sync.js").then((module) => module.default);
var ci = (iterator) => module.then((ci) => ci(iterator));
export default async function*fulfilled() {
  for (const value of await ci(this)) {
    try {
      if (value && value.then) yield await value;
      else yield value;
    } catch (_) {}
  }
};
