function pick(source = {}, keys = []) {
  const result = {};
  keys.forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      result[key] = source[key];
    }
  });
  return result;
}

function omitUndefined(source = {}) {
  const result = {};
  Object.entries(source).forEach(([key, value]) => {
    if (typeof value !== 'undefined') {
      result[key] = value;
    }
  });
  return result;
}

module.exports = {
  pick,
  omitUndefined,
};
