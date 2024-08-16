Reflect.setPrototypeOf(Promise.prototype, Object.assign(Promise.prototype, {
  ap: function (functor) {
    return Promise.all([functor, this]).then(([arg, call]) => call(arg));
  },
  call: function (functor) {
    return Promise.all([functor, this]).then(([call, arg]) => call(arg));
  }
}));
