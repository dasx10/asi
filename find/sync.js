async function trusy () {
  var value; for (value of this) if (await value) return value.value;
};

export var then = (resolve) => import("../exec.js")
  .then((exec) => function (call, ...thisArgs) {
    return exec.call(
      this,
      function*(call) {
       var index = 0;
       var expected = new Array(0);
       var value, promise;
       for (value of this) {
         promise = (value && value.then)
           ? Promise.all([value, index++]).then(({ 0: value, 1: index }) => call(value, index++, this))
           : call(value, index++, this)
         ;
         if (promise) {
           if (promise.then || expected.length) expected.push(Promise.resolve(promise).then((status) => status && ({ value })));
           else return value;
         }
       }

       return expected.length
         ? trusy.call(expected)
         : void 0
       ;
      },
      call,
      ...thisArgs
    );
  })
  .then(resolve)
;
