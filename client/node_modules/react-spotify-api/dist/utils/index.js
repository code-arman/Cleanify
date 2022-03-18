export function serialize(obj, isStartingFromMiddle = false) {
  const str = [];

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push("".concat(encodeURIComponent(key), "=").concat(encodeURIComponent(obj[key])));
    }
  }

  return str.length > 0 && !isStartingFromMiddle ? '?' + str.join('&') : '';
}