var delay = (timeMs) => new Promise(resolve => Promise.resolve(timeMs).then((ms) => setTimeout(resolve, ms)));
export var then = (resolve) => resolve(async function*interval(time) {
  if (this[Symbol.iterator]) for (var value of this) {
    await delay(time);
    yield value;
  }
  else if (this[Symbol.asyncIterator]) for await (var value of this) {
    await delay(time);
    yield value;
  }
  else if (this.then) return yield*interval.call(await this, time);
  else {
    await delay(time);
    yield this;
  }
});
