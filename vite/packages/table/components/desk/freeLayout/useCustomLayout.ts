import { storeToRefs } from "pinia";
import { nanoid } from "nanoid";

import { useAddCard } from "../../../ui/hooks/useAddCard";
import {
  useGridToWidth,
  useHeightToGrid,
  useElementSize,
} from "../../../ui/hooks/useCardSize";
import { useFreeLayoutStore } from "../freeLayout/store";

export const useCustomLayout = async (
  mainList = [],
  headerList = [],
  folderList = []
) => {
  const freeLayoutStore: any = useFreeLayoutStore();
  const { getFreeLayoutData, getFreeLayoutState, freeLayoutEnv } =
    storeToRefs(freeLayoutStore);
  freeLayoutStore.renewFreeLayout();

  getFreeLayoutState.value.system.isFreeLayout = true;

  const columns = 5;
  let containerWidth = freeLayoutEnv.value.scrollWidth;
  let layoutWidth = useGridToWidth(columns * 2);
  let scaleFactor = 1;
  let position = 50;
  // 重置left坐标
  const resetLeft = () => {
    left = freeLayoutEnv.value.scrollLeft / scaleFactor + position;
  };
  const itemStatus = (item) => {
    const { width, height }: any = useElementSize(item.customData.customSize);
    // console.log(
    //   "\u001b[31m" + "----------------数据处理----------------" + "\u001b[0m"
    // );
    // console.log(
    //   "id",
    //   item?.id,
    //   ",name",
    //   item.customData.name || item.name,
    //   ",元素width :>> ",
    //   width,
    //   ",当前位置left :>> ",
    //   left - freeLayoutEnv.value.scrollLeft,
    //   ",当前位置缩放后left :>> ",
    //   left - freeLayoutEnv.value.scrollLeft * scaleFactor
    // );
  };
  // 设置卡片数据
  const setData = async (arr: any) => {
    for (let item of arr.splice(0, arr.length)) {
      // 处理元素位置
      const { width, height }: any = useElementSize(item.customData.customSize);
      currentHeight = height;

      itemStatus(item);
      if (widthDetection(width)) {
        console.log("开始请求填充算法 :>> ");
        fillGapAlgorithm();
        console.log("------处理结束------");
        resetLeft();
        top += height + 12;
      }
      addCard(top, left, item);
      left += width + 12;
    }
    fillGapAlgorithm();
    resetLeft();
    top += currentHeight + 12;
  };
  // 检测是否超出
  const widthDetection = (width) => {
    let res =
      left - freeLayoutEnv.value.scrollLeft / scaleFactor + width - position;
    const active = res > layoutWidth;
    return active;
  };
  // 缩放算法
  const scaleAlgorithm = () => {
    let currentZoom = getFreeLayoutState.value.canvas.zoom;
    if (layoutWidth * currentZoom >= containerWidth) {
      currentZoom = containerWidth / (layoutWidth + 100);
      //  确保元素在不改变宽高比的前提下缩放至适合容器宽度
      getFreeLayoutState.value.canvas.zoom = currentZoom;
      position = 50;
    } else {
      position = (containerWidth / currentZoom - layoutWidth) / 2;
      console.log("position :>> ", position);
    }
    scaleFactor = currentZoom;
    console.log("scaleFactor :>> ", scaleFactor);
  };
  // 填充算法
  const fillGapAlgorithm = async () => {
    // 无余数
    if (arr2x4.length == 0 && arr2x2.length == 0) return true;
    // 无位置
    let active = widthDetection(280);
    if (active) return true;
    if (arr2x4.length > 0 && currentHeight > 280) {
      fill2x4();
    } else if (arr2x2.length > 0) {
      fill2x2();
    } else {
      return;
    }

    fillGapAlgorithm();
  };
  const fill2x4 = async () => {
    for (let item of arr2x4.splice(0, 1)) {
      if (!item) return;
      console.log("2x4填充 :>> ");
      itemStatus(item);
      const { width, height }: any = useElementSize(item.customData.customSize);
      addCard(top, left, item);
      left += width + 12;
    }
    return;
  };

  const fill2x2 = (arr = arr2x2, height = currentHeight) => {
    let currentTop = top;
    let rows = useHeightToGrid(height) / 2;
    let num = arr.length >= rows ? rows : arr.length;
    // console.log("rows :>> ", rows);
    for (let item of arr.splice(0, num)) {
      if (!item) return;
      console.log("2x4填充 :>> ");
      itemStatus(item);
      const { width, height }: any = useElementSize(item.customData.customSize);
      addCard(currentTop, left, item);
      currentTop += height + 12;
    }
    left += 280 + 12;
    return;
  };

  scaleAlgorithm();
  // scaleFactor = 1

  let left = 1;
  let top = freeLayoutEnv.value.scrollTop / scaleFactor;
  let currentHeight;
  // 初始化数据
  resetLeft();

  let { arr2x2, arr2x4, arr4x4 } = arraySplit(mainList);

  if (headerList.length) {
    let { arr2x2: header2x2, arr2x4: header2x4 } = arraySplit(headerList);
    let num2x2 = header2x2.length / 2;

    for (let index = 0; index < num2x2; index++) {
      fill2x2(header2x2, 420);
    }
    setData(header2x4);
  }
  if (folderList.length > 0) {
    let { arr2x2: folder2x2 } = arraySplit(folderList);
    resetLeft();
    setData(folder2x2);
  }
  resetLeft();

  setData(arr4x4);
  resetLeft();

  setData(arr2x4);

  setData(arr2x2);
};
const arraySplit = (arr) => {
  let arr2x2: any = [];
  let arr2x4: any = [];
  let arr4x4: any = [];

  arr.forEach((item) => {
    if (!item.customData.customSize) return;
    let str = item.customData.customSize.split("x");
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

  let id = item?.id || nanoid(4);

  let a = left;
  getFreeLayoutData.value[id] = {
    left: a,
    top: top,
    index: 1,
    id,
  };

  if (item.id) return;

  useAddCard(
    item.name,
    {
      ...item.customData,
    },
    id
  );
};
