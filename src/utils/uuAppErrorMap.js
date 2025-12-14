function ensureUuAppErrorMap(map = {}) {
  return map;
}

function addMapEntry(map, code, type, message, paramMap = {}) {
  const uuMap = ensureUuAppErrorMap(map);
  uuMap[code] = { type, message, paramMap };
  return uuMap;
}

function addWarning(map, code, message, paramMap = {}) {
  return addMapEntry(map, code, 'warning', message, paramMap);
}

function addError(map, code, message, paramMap = {}) {
  return addMapEntry(map, code, 'error', message, paramMap);
}

module.exports = {
  addError,
  addWarning,
  ensureUuAppErrorMap,
};
