import { storeToRefs } from "pinia";
import { nanoid } from "nanoid";

import { useAddCard } from "../../../ui/hooks/useAddCard";
import { useFreeLayoutStore } from "../freeLayout/store";

import { folderData, headerData, mainData } from "./config";
// const generateRandomSizes = () => {

//   // for (let i = 0; i < count; i++) {
//   //   let width = (Math.floor(Math.random() * 2) + 1) * 2;
//   //   let height = (Math.floor(Math.random() * 2) + 1) * 2;
//   //   arr.push({
//   //     size: `${width}x${height}`,
//   //     name: "test",
//   //   });
//   // }
//   return arr;
// };

export const useCustomLayout = (
  mainList = [...mainData],
  headerList = [...headerData],
  folderList = [...folderData]
) => {
  const freeLayoutStore: any = useFreeLayoutStore();
  const { getFreeLayoutData, getFreeLayoutState, freeLayoutEnv } =
    storeToRefs(freeLayoutStore);

  const rows = 4;
  let containerWidth = freeLayoutEnv.value.scrollWidth;
  let boxWidth = rows * 280 + (rows - 1) * 12;
  let position = (containerWidth - boxWidth) / 2;

  /**
   * 内置函数
   */
  let left;
  // 重置left坐标
  const resetLeft = () => {
    left = freeLayoutEnv.value.scrollLeft + position;
  };
  // 重置坐标
  const resetTop = (n) => {
    top += 96 * n + n * 12;
  };
  // 设置卡片数据
  const setData = (arr) => {
    arr.forEach((item) => {
      const { width, height }: any = getSize(item.size);
      addCard(top, left, item);
      if (left - freeLayoutEnv.value.scrollLeft - position + width < boxWidth) {
        left += width + 12;
      } else {
        resetLeft();
        top += height + 12;
      }
    });
  };
  // 填充算法
  const fillGapAlgorithm = (rule = "all") => {
    // 无余数
    if (arr2x4.length == 0 && arr2x2.length == 0) return;
    // 无位置
    const active =
      left - freeLayoutEnv.value.scrollLeft - position + 280 <= boxWidth;
    if (!active) return;
    // let rows: any = (boxWidth - require) / 280;
    // rows = parseInt(rows);
    fillRule(rule);

    fillGapAlgorithm();
  };
  const fillRule = (rule) => {
    if (rule === "all") {
      if (arr2x4.length > 0) {
        fill2x4();
      } else if (arr2x2.length > 0) {
        fill2x2();
      }
    } else if (rule === "2x4") {
      fill2x4();
    } else if (rule === "2x2") {
      fill2x2();
    }
  };
  const fill2x4 = () => {
    arr2x4.splice(0, 1).forEach((item) => {
      if (!item) return;
      const { width, height }: any = getSize(item.size);
      addCard(top, left, item);
      left += width + 12;
    });
  };

  const fill2x2 = (arr = arr2x2) => {
    let currentTop = top;
    let num = arr.length > 2 ? 2 : arr.length;
    arr.splice(0, num).forEach((item) => {
      if (!item) return;
      const { width, height }: any = getSize(item.size);
      addCard(currentTop, left, item);
      currentTop += height + 12;
    });
    left += 280 + 12;
  };

  // 初始化数据
  resetLeft();
  let top = freeLayoutEnv.value.scrollTop;
  let { arr2x2, arr2x4, arr4x4 } = arraySplit(mainList);

  /**
   * 头部区域
   */
  if (headerList.length) {
    let { arr2x2, arr2x4 } = arraySplit(headerList);
    let num2x2 = arr2x2.length / 2;

    for (let index = 0; index < num2x2; index++) {
      fill2x2(arr2x2);
    }

    setData(arr2x4);
  }


  /**
   * 文件夹区域
   */
  resetLeft();
  if (folderList.length > 0) {
    setData(folderList);
  }

  let folderListLength = 4 - folderList.length;
  if (folderListLength >= 1 && arr2x2.length >= folderListLength) {
    fillGapAlgorithm("2x2");
  }
  resetLeft();
  resetTop(2);

  setData(arr4x4);
  setData(arr2x4.splice(0, arr2x4.length));
  fillGapAlgorithm();
  resetLeft();
  resetTop(4);
  setData(arr2x2);
};

const getWidth = (w) => {
  return w * 134 + (w - 1) * 12;
};
const getHeight = (h) => {
  return h * 96 + (h - 1) * 12;
};

const getSize = (size) => {
  let str = size.split("x");

  const w = str[0];
  const h = str[1];

  return {
    width: getWidth(parseInt(w)),
    height: getHeight(parseInt(h)),
  };
};
const arraySplit = (arr) => {
  let arr2x2: any = [];
  let arr2x4: any = [];
  let arr4x4: any = [];

  arr.forEach((item) => {
    let str = item.size.split("x");
    const w = parseInt(str[0]);
    const h = parseInt(str[1]);
    if (w == 2 && h == 2) {
      arr2x2.push(item);
    } else if (w == 2 && h == 4) {
      arr2x4.push(item);
    } else if (w == 4 && h == 4) {
      arr4x4.push(item);
    }
  });
  return {
    arr2x2,
    arr2x4,
    arr4x4,
  };
};

// 添加卡片
const addCard = (top, left, item) => {
  const freeLayoutStore: any = useFreeLayoutStore();
  const { getFreeLayoutData, getFreeLayoutState, freeLayoutEnv } =
    storeToRefs(freeLayoutStore);
  let id = nanoid(4);

  getFreeLayoutData.value[id] = {
    left: left,
    top: top,
    index: 1,
    id,
  };

  useAddCard(
    item.name,
    {
      ...item,
    },
    id
  );
};
