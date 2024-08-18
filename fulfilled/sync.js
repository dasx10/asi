var then = (resolve) => resolve(async function*fulfilled() {
  for (const value of this) {
    try {
      if (value && value.then) yield await value;
      else yield value;
    } catch (_) {}
  }
});
