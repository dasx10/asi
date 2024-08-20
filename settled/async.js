export var then = (resolve) => resolve(async function*() {
  var iterator = (this)[Symbol.asyncIterator]();
  var is;
  while (true) {
    try {
      is = await iterator.next();
      if (is.done) return is.value;
      yield ({
        reason : undefined,
        state  : "fulfilled",
        value  : (is.value && is.value.then) ? await is.value : is.value,
      });
    } catch(reason) {
      yield ({
        reason : reason,
        state  : "rejected",
        value  : undefined,
      })
    }
  }
});
