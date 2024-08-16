function reduce (call, ...thisArg) {
  return this.reduce
    ? this.reduce((create, value, index, values) => (create.then || value.then) ? Promise.all([create, value]).then(({ 0: create, 1: value }) => call(create, value, index, values)) : call(create, value, index, values), ...thisArg)
  : import("../ci/sync.js").then((ci) => ci(this).then((iterable) => {
     var create = thisArg.length ? thisArg[0] : iterable.next().value;
     var index = 0;
     for (const value of iterable) {
       index++;
       create = (create.then || value.then)
         ? Promise.all([create, value, index]).then(({ 0: create, 1: value, 2: index }) => call(create, value, index, this))
         : call(create, value, index, this)
       ;
     }
     return create;
  }));
};
export default reduce;
export const then = (resolve) => resolve(reduce);
