var delay = (timeMs) => new Promise(resolve => Promise.resolve(timeMs).then((ms) => setTimeout(resolve, ms)));
export var then = (resolve) => resolve(async function*interval(time, timer = delay(time)) {
  if (this[Symbol.iterator]) {
    for (var value of this) {
      await timer;
      yield value;
      timer = delay(time);
    }
  }
  else if (this[Symbol.asyncIterator]) {
    for await (var value of this) {
      await timer;
      yield value;
      timer = delay(time);
    }
  }
  else if (this.then) return yield*interval.call(await this, time, timer);
  else {
    await timer;
    yield this;
  }
});
