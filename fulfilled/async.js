var then = (resolve) => resolve(async function*fulfilled() {
  var iterator = (this)[Symbol.asyncIterator]();
  while (true) {
    var promise = iterator.next();
    try{
      var { done, value } = await promise;
      if (done) return value;
      yield value;
    }catch(_){}
  }
});
