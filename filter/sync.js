export var then = (resolve) => import("../exec.js")
  .then((exec) => function (call, ...thisArgs) {
    return exec.call(
      this,
      async function*(call) {
        var index = 0;
        var status;
        var value;
        for (value of this) {
          value  = (value && value.then) ? await value : value;
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
