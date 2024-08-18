var then = (resolve) => resolve(async function*fulfilled() {
  var iterator = (this)[Symbol.asyncIterator]();
  var is;
  while (true) {
    try{
      is = await iterator.next();
      if (is.done) return is.value;
      yield is.value;
    }catch(_){}
  }
});
