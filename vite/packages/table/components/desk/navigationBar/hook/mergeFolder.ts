import { nanoid } from "nanoid";
/**
 * 合并图标组
 * @param list
 * @param index
 * @param targetIndex
 */
export const useMergeFolder = (list, from, target) => {
  if (!target) {
    console.warn("获取不到target");
    return;
  }
  if (target.type === "folder") {
    return {
      name: target.name || "文件夹",
      bg: target.bg || "",
      isBg: false,
      icon: target.icon || "",
      type: "folder",
      value: "folder",
      children: childrenFolder([from, target]).flat(1),
      mode: "app",
      id: nanoid(6),
      size: target.size || "",
      layout: target.layout || "",
      color: target.color || "",
    };
  }
  return {
    name: "文件夹",
    bg: "",
    isBg: false,
    icon: "",
    type: "folder",
    value: "folder",
    children: childrenFolder([from, target]).flat(1),
    mode: "app",
    id: nanoid(6),
  };
};

/**
 * 取出元素的children数组
 * @param list
 */
export const childrenFolder = (list) => {
  let arr = [];
  list.forEach((item) => {
    if (item && item.children) {
      arr.push(...childrenFolder(item.children));
    } else {
      arr.push(item);
    }
  });
  return deduplicateArray(arr);
};

export const deduplicateArray = (arr) => {
  return arr.reduce((uniqueArray, item) => {
    // 检查是否已经存在于 uniqueArray 中
    const exists = uniqueArray.some((i) => {
      if (i.type === "coolApp") {
        return i.value.url === item.value.url;
      } else {
        return i.value === item.value;
      }
    });

    // 如果不存在，则将当前元素添加到 uniqueArray
    if (!exists) {
      uniqueArray.push(item);
    }

    return uniqueArray;
  }, []);
};
