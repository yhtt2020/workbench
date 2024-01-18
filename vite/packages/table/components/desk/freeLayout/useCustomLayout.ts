import { storeToRefs } from "pinia";
import { nanoid } from "nanoid";

import { useAddCard } from "../../../ui/hooks/useAddCard";

import { useFreeLayoutStore } from "../freeLayout/store";
let headerData = [
  {
    size: "2x2",
    name: "header",
  },
  {
    size: "2x2",
    name: "header",
  },
  {
    size: "2x4",
    name: "header",
  },
  {
    size: "2x4",
    name: "header",
  },
  {
    size: "2x4",
    name: "header",
  },
];
let folderData = [
  {
    size: "2x2",
    name: "folder",
  },
  {
    size: "2x2",
    name: "folder",
  },
];
export const useCustomLayout = (
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
  const resetLeft = () => {
    left = freeLayoutEnv.value.scrollLeft + position;
  };
  resetLeft();
  let top = freeLayoutEnv.value.scrollTop;

  headerList.splice(0, 2).forEach((item) => {
    const { width, height } = getSize(item.size);
    setCard(top, left, item);
    top += height + 12;
  });

  headerList.forEach((item) => {
    let top = freeLayoutEnv.value.scrollTop;
    const { width, height } = getSize(item.size);
    left += width + 12;
    setCard(top, left, item);
  });
  /**
   * 文件夹区域
   */

  resetLeft();
  if (folderList.length > 0) {
    folderList.forEach((item) => {
      const { width, height } = getSize(item.size);
      setCard(top, left, item);
      left += width + 12;
    });
  }
  let arr = generateRandomSizes(12);

  let arr2x2: any = [];
  let arr2x4: any = [];
  let arr4x4: any = [];

  arr.forEach((item) => {
    const { width, height }: any = getSize(item.size);
    if (width == 280 && height == 204) {
      arr2x2.push(item);
    } else if (width == 280 && height == 420) {
      arr2x4.push(item);
    } else if (width == 572 && height == 420) {
      arr4x4.push(item);
    }
  });
  console.log("arr :>> ", arr);
  console.log("arr2x2 :>> ", arr2x2);
  console.log("arr2x4 :>> ", arr2x4);
  console.log("arr4x4 :>> ", arr4x4);
  let folderListLength = 4 - folderList.length;

  // 有文件夹 但没占满
  if (folderListLength >= 1 && arr2x2.length >= folderListLength) {
    arr2x2.splice(0, folderListLength).forEach((item) => {
      const { width, height }: any = getSize(item.size);
      setCard(top, left, item);
      left += width + 12;
    });
  }
  resetLeft();
  top += 240 - 12 * 2;

  arr4x4.forEach((item) => {
    const { width, height }: any = getSize(item.size);
    setCard(top, left, item);
    if (left - freeLayoutEnv.value.scrollLeft - position + width < boxWidth) {
      console.log("123 :>> ", 123);
      left += width + 12;
    } else {
      console.log("321 :>> ", 321);
      resetLeft();
      top += height + 12;
    }
  });
  return;
  arr2x4.forEach((item) => {
    const { width, height }: any = getSize(item.size);
    setCard(headerTop, left, item);
    if (left - freeLayoutEnv.value.scrollLeft - position + width < boxWidth) {
      left += width + 12;
    } else {
      resetLeft();
      headerTop += height + 12;
    }
  });

  if (left - freeLayoutEnv.value.scrollLeft + 280 <= boxWidth) {
    let a = (boxWidth - (left - freeLayoutEnv.value.scrollLeft)) / 280;

    for (let index = 0; index < a; index++) {
      console.log("index :>> ", index);
    }
  }
  resetLeft();
  arr2x2.forEach((item) => {
    const { width, height }: any = getSize(item.size);
    setCard(headerTop, left, item);

    if (left - freeLayoutEnv.value.scrollLeft - position + width < boxWidth) {
      left += width + 12;
    } else {
      resetLeft();

      headerTop += height + 12;
    }
  });
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

const setCard = (top, left, item) => {
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

  useAddCard("test", item, id);
};

const generateRandomSizes = (count) => {
  let arr: any = [
    {
      size: "2x2",
      name: "其他小组件",
    },
    {
      size: "2x2",
      name: "其他小组件",
    },
    {
      size: "2x2",
      name: "其他小组件",
    },
    {
      size: "2x2",
      name: "其他小组件",
    },
    {
      size: "2x4",
      name: "其他小组件",
    },
    {
      size: "2x4",
      name: "其他小组件",
    },
  ];
  for (let i = 0; i < count; i++) {
    let width = (Math.floor(Math.random() * 2) + 1) * 2;
    let height = (Math.floor(Math.random() * 2) + 1) * 2;
    arr.push({
      size: `${width}x${height}`,
      name: "其他小组件",
    });
  }
  return arr;
};
