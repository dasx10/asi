export var then = (resolve) => resolve(async function*fulfilled() {
  var iterator = (this)[Symbol.asyncIterator]();
  var is;
  while (true) {
    try{
      is = await iterator.next();
      if (is.done) return is.value;
      (is.value && is.value.then) ? await is.value : is.value;
    } catch (error) {
      yield error;
    }
  }
});
