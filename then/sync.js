var module = import("../ci/sync.js").then((module) => module.default);
var ci = (iterator) => module.then((ci) => ci(iterator));
export default async function (resolve, reject) {
  try {
    const values = [];
    for (const value of await ci(this)) values.push(value && value.then ? (await value) : value);
    resolve && resolve(values);
    return this;
  } catch (error) {
    reject ? reject(error) : Promise.reject(error);
  }
}
