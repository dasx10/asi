var module = import("../ci/async.js").then((module) => module.default);
var ci = (iterator) => module.then((ci) => ci(iterator));
export default async function (resolve, reject) {
  try {
    if (resolve) {
      const values = [];
      for await (const value of (await ci(this))) values.push(value);
      resolve(values);
    } else if (reject) for await (const _ of (await ci(this)));
    return this;
  } catch (error) {
    reject ? reject(error) : Promise.reject(error);
  }
}
