var modules = new Map();
var loads   = new Map();
var load = (path) => function (...args) {
  return modules.has(path)
    ? modules.get(path).call(this, ...args)
    : loads.has(path)
      ? loads.get(path).then((module) => module.call(this, ...args))
      : loads.set(path, import(path).then((module) => (loads.delete(path), modules.set(path, module), module))).get(path)
    .then((module) => module.call(this, ...args))
};
export var then = (resolve) => resolve(load);
export default load;
