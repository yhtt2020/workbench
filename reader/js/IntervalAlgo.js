//区间算法
//实现区间列表，插入新区间，保证不重叠（可以移动老区间，要保证最小移动，不可移动插入区间）算法
/**
 *
 * @param {*} newArr 需要排序的区间
 * @param {*} noOverlapArr 已经排序好的区间数组
 * @param {*} spacing 间距
 * @returns
 */
export default function algo(newArr, noOverlapArr, spacing = 0) {
  const start = newArr[0];
  const end = newArr[1];
  //要插入的位置索引
  let insetIndex = noOverlapArr.findIndex((item) => start < item[0]);
  // debugger
  if (noOverlapArr.length == 0) {
    noOverlapArr.push(newArr);
    return noOverlapArr;
  }

  insetIndex = insetIndex == -1 ? noOverlapArr.length : insetIndex;
  // console.log(noOverlapArr);
  // console.log(insetIndex);
  if (insetIndex !== 0 && noOverlapArr[insetIndex - 1][1] > start) {
    let i = insetIndex - 1;
    //插入的区间正好在要插入索引前一个区间中（发生重叠）
    //把重叠区域向前做最小迁移
    let moveStep = noOverlapArr[i][1] - start + spacing;
    // console.log("moveStep", moveStep);
    while (i >= 0 && moveStep > 0) {
      noOverlapArr[i][0] -= moveStep;
      noOverlapArr[i][1] -= moveStep;
      const preEnd = noOverlapArr[i - 1] ? noOverlapArr[i - 1][1] : 0;
      moveStep = preEnd - noOverlapArr[i][0] + spacing;
      i--;
    }
  }
  if (insetIndex !== noOverlapArr.length&&end>noOverlapArr[insetIndex][0]) {
    //对于插入位置后面的元素，如果和后面发生重叠，则把重叠区域向后做最小迁移
    let i = insetIndex;
    let moveStep = end - noOverlapArr[i][0]+spacing;
    while (i < noOverlapArr.length && moveStep > 0) {
      noOverlapArr[i][0] += moveStep;
      noOverlapArr[i][1] += moveStep;
      const nextStart = noOverlapArr[i + 1] ? noOverlapArr[i + 1][0] : Infinity;
      moveStep = noOverlapArr[i][1] - nextStart+spacing;
      i++;
    }
  }

  noOverlapArr.splice(insetIndex, 0, newArr);
  return noOverlapArr;
}


