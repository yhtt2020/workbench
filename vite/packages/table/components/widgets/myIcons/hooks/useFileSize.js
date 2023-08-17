export function getObjectSize(obj) {
  let size = 0;

  if (typeof obj === "object" && obj !== null) {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        size += key.length * 2; // 属性名大小
        size += getObjectSize(value); // 属性值大小
      }
    }
  } else if (typeof obj === "string") {
    size += obj.length * 2; // 字符串大小
  } else if (typeof obj === "number") {
    size += obj.toString().length * 2; // 数字大小
  } else if (typeof obj === "boolean") {
    size += 4; // 布尔值大小
  }

  return size;
}

export function formatArrayAsFileSize(array) {
  let totalSize = 0;

  for (let i = 0; i < array.length; i++) {
    let elementSize = getObjectSize(array[i]);
    totalSize += elementSize;
  }

  return formatFileSize(totalSize);
}

export function formatFileSize(size) {
  if (size < 1024) {
    return size + " B";
  } else if (size < 1024 * 1024) {
    return (size / 1024).toFixed(2) + " KB";
  } else if (size < 1024 * 1024 * 1024) {
    return (size / (1024 * 1024)).toFixed(2) + " MB";
  } else {
    return (size / (1024 * 1024 * 1024)).toFixed(2) + " GB";
  }
}
