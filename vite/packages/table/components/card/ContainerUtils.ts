// 深度合并
export const deepMerge = (target, source) => {
  for (let key in source) {
    if (source.hasOwnProperty(key)) {
      if (typeof source[key] === "object" && source[key] !== null) {
        if (!target.hasOwnProperty(key)) {
          Object.assign(target, { [key]: {} });
        }
        deepMerge(target[key], source[key]);
      } else {
        if (!target.hasOwnProperty(key)) {
          Object.assign(target, { [key]: source[key] });
        }
      }
    }
  }
};
