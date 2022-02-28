export  function deepCopy(obj) {
  if (typeof obj !== 'object') return;
  var newObj = obj instanceof Array ? [] : {};
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      newObj[key] = Object.prototype.toString.call(obj[key]) === '[object Array]' ? deepCopy(obj[key]) : obj[key];
    }
  }
  return newObj;
}
