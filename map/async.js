export var then = (resolve) => import("../exec.js")
  .then((exec) => function (call, ...thisArgs) {
    return exec.call(
      this,
      async function*(call) {
        var value, index = 0;
        for await (value of this) yield call(value, index++, this);
      },
      call,
      ...thisArgs
    );
  })
  .then(resolve)
;
