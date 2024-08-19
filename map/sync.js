export var then = (resolve) => import("../exec.js")
  .then((exec) => function (call, ...thisArgs) {
    return exec.call(
      this,
      function*(call) {
        var value, index = 0;
        for (value of this) yield (value && value.then)
          ? value.then((value) => call(value, index++, this))
          : call(value, index++, this)
        ;
      },
      call,
      ...thisArgs
    );
  })
  .then(resolve)
;
