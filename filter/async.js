export var then = (resolve) => import("../exec.js")
  .then((exec) => function (call, ...thisArgs) {
    return exec.call(
      this,
      async function*(call) {
        var index = 0;
        var status;
        var value;
        for await (value of this) {
          status = call(value, index++, this);
          status = (status && status.then) ? await status : status;
          if (status) yield value;
        }
      },
      call,
      ...thisArgs
    );
  })
  .then(resolve)
;
