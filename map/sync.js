import ci from "../ci/sync.js";
export default function*map(call, ...thisArg) {
  const exec = thisArg.length ? call.bind(thisArg[0]) : call;
  var index = 0;
  for (const value of ci(this)) value && value.then
    ? yield value.then((value) => exec(value, index++, this))
    : yield exec(value, index++, this)
  ;
}
