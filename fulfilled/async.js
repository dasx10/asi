var module = import("../ci/async.js").then((module) => module.default);
var ci = (iterator) => module.then((ci) => ci(iterator));
export default async function*fulfilled() {
  var iterator = await ci(this);
  while (true) {
    var promise = iterator.next();
    try{
      var { done, value } = await promise;
      if (done) return value;
      yield value;
    }catch(_){}
  }
};
