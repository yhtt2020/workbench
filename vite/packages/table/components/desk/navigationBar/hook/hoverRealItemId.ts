/**
 * 取出当前鼠标指针所对应的数组内的元素的真实id，采用视图查找，所以是精准的
 * @param id {string} 导航栏id
 * @param index {number} 当前鼠标指针所对应的数组内的元素的索引
 * @returns {string}
 */
export const hoverRealItemId = (id, index) => {
  let parent = document.getElementById(id);
  if (!parent) {
    return "";
  }
  if (index < 0) {
    return;
  }
  let i = 0;
  for (const child of parent.children) {
    if (i === index) {
      if (child) {
        return child.id;
      }
    }
    i++;
  }
  return "";
};
