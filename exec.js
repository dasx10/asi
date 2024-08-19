export var then = (resolve) => resolve(function executor(exec, call, ...thisArgs) {
  return call.then
    ? thisArgs.length > 0
      ? thisArgs[0].then
        ? Promise.all([call, thisArgs[0]]).then(({ 0: call, 1: thisArg }) => exec.call(this, call.bind(thisArg)))
        : call.then((call) => exec.call(this, call.bind(thisArgs[0])))
      : call.then((call) => exec.call(this, call))
    : thisArgs.length > 0
      ? thisArgs[0].then
        ? thisArgs[0].then((thisArg) => exec.call(this, call.bind(thisArg)))
        : exec.call(this, call.bind(thisArgs[0]))
      : exec.call(this, call)
});
