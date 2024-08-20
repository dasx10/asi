async function*concat(...values) {
  yield*this;
  var value;
  for await (value of values) {
    if (value[Symbol.iterator]) yield*value;
    else if (value[Symbol.asyncIterator]) yield*value;
    else {
      value = value.then ? await value : value;
      if (value[Symbol.iterator]) yield*value;
      else if (value[Symbol.asyncIterator]) yield*value;
      else yield value;
    }
  }
}

export var then = (resolve) => resolve(concat);
