import { storeToRefs } from "pinia";
import { nanoid } from "nanoid";
import _ from "lodash";

import { useAddCard, useDelCard } from "../../../ui/hooks/useAddCard";
import { getSnapGrid } from "../../../ui/new/drag/src/hooks/utils";
import {
  useGridToWidth,
  useHeightToGrid,
  useElementSize,
} from "../../../ui/hooks/useCardSize";
import { useFreeLayoutStore } from "../freeLayout/store";
import { useCutLayout } from "./useCutLayout";

const defaultOptions = {
  mainList: [],
  headerList: [],
  folderList: [],
  columns: 4,
  cb: () => {},
  test: true,
};

export const useCustomLayout = async (options) => {
  // 合并默认配置和用户配置
  const mergedOptions = _.merge({}, defaultOptions, options);
  const { mainList, headerList, folderList, columns, cb, test } = mergedOptions;
  let layoutWidth = useGridToWidth(columns * 2);

  let currentLeft = 0;
  let currentTop = 0;
  // 换行检测
  const isExceedMaxWidth = (width: any) => {
    if (currentLeft + width > layoutWidth) {
      return true;
    }
  };
  // 当前元素宽高
  let currentWidth = 0;
  let currentHeight = 0;
  // 上一个元素宽高
  let prevWidth = 0;
  let prevHeight = 0;
  //
  let fillTop = 0;
  let fillLeft = 0;
  //
  let fillWidth = 0;
  let fillHeight = 0;
  // 1 实现卡片分类
  const { arr2x2, arr2x4, arr4x4, arr1x1, arrSpecial } =
    cardClassification(mainList);
  /**
   * 换行填充
   * 采用高度优先
   */
  const fillGap = () => {
    // 无位置
    if (isExceedMaxWidth(134)) {
      return;
    }

    if (arr2x4.length > 0 && prevHeight - 420 >= 0) {
      console.log("2x4填充 :>> ");
      fill(arr2x4);
    } else if (arr2x2.length > 0 && prevHeight - 204 >= 0) {
      console.log("2x2填充 :>> ");
      fill(arr2x2);
    } else if (arr1x1.length > 0 && prevHeight - 204 >= 0) {
      console.log("1x1填充 :>> ");
      fill(arr1x1);
    } else {
      return;
    }

    fillGap();
  };
  // 当前top
  const fill = (arr: any) => {
    const item = arr[0];
    const { width, height }: any = useElementSize(item?.customData?.customSize);
    /**
     * 判断是否需要换行
     */
    if (fillTop + height > prevHeight + currentTop) {
      console.log("填充过程换行 :>> ");
      // 换行
      currentLeft += fillWidth + 12;
      fillLeft = currentLeft;
      // 重置填充高度
      fillTop = currentTop;
    }
    /**
     * 判断是否超出最大宽度
     */
    if (isExceedMaxWidth(134)) {
      // 数据归还
      console.log("超出了 :>> ");
      return;
    }

    console.log("完成一次填充 :>> ", item);
    // 将数据分离原数组
    arr.splice(0, 1);
    updateCardPosition(fillTop, fillLeft, item);
    fillTop += height + 12;
    fillWidth = width;
    fillHeight = height;
  };
  const start = () => {
    if (currentLeft > 0) {
      console.log("填充启动 :>> ");
      fillTop = currentTop;
      fillLeft = currentLeft;
      fillGap();
    }

    currentLeft = 0;
    currentTop += prevHeight + 12;
    prevHeight = 0;
  };
  let lastHeight = 0;
  const cardPositionInit = (arr: any) => {
    if (!arr.length) return;
    // 循环取出
    for (const item of arr.splice(0, arr.length)) {
      // 获取宽高
      const { width, height }: any = useElementSize(item.customData.customSize);

      currentWidth = width;
      currentHeight = height;
      // 是否换行
      if (isExceedMaxWidth(width)) {
        console.log("换行介入 :>> ");
        start();
      } else if (prevHeight != 0 && prevHeight != currentHeight) {
        console.log("高度不相等介入 :>> ");
        /**
         * 是否两个元素高度不一致
         * 为 0 代表第一次 则不换行
         */
        currentLeft = 0;
        currentTop += prevHeight + 12;
      }
      console.log("正常添加 :>> ", item);

      updateCardPosition(currentTop, currentLeft, item);
      currentLeft += width + 12;
      lastHeight = prevHeight;
      prevWidth = currentWidth;
      prevHeight = currentHeight;
    }
    start();
  };

  const freeLayoutStore: any = useFreeLayoutStore();
  const { getFreeLayoutState, freeLayoutEnv } = storeToRefs(freeLayoutStore);
  let position;
  let containerWidth = freeLayoutEnv.value.scrollWidth;
  let scaleFactor = 1;
  const scaleAlgorithm = () => {
    let currentZoom = getFreeLayoutState.value.canvas.zoom;
    if (layoutWidth * currentZoom >= containerWidth) {
      currentZoom = containerWidth / (layoutWidth + 100);
      //  确保元素在不改变宽高比的前提下缩放至适合容器宽度
      getFreeLayoutState.value.canvas.zoom = currentZoom;
      position = 50;
    } else {
      position = (containerWidth / currentZoom - layoutWidth) / 2;
    }
    scaleFactor = currentZoom;
  };
  scaleAlgorithm();

  /**
   * 初始化自由布局
   */ // 扩展画布大小
  getFreeLayoutState.value.canvas.height += 20000;
  getFreeLayoutState.value.canvas.width += 20000;
  // 启用自由布局
  if (!getFreeLayoutState.value.system.isFreeLayout)
    getFreeLayoutState.value.system.isFreeLayout = true;
  // 隐藏
  getFreeLayoutState.value.system.hide = true;
  let positioningId = await addPositioningData();
  cardPositionInit(arrSpecial);
  cardPositionInit(arr4x4);
  cardPositionInit(arr2x4);
  cardPositionInit(arr2x2);
  cardPositionInit(arr1x1);
  // 开始收尾
  useDelCard(positioningId);
  console.log("cb :>> ", cb);
  cb && cb(position);
};
/**
 * 卡片分类
 */
const cardClassification = (arr) => {
  console.log("1、卡片分类 :>> ");
  const arr2x2: any = [];
  const arr2x4: any = [];
  const arr4x4: any = [];
  const arr1x1: any = [];
  const arrSpecial: any = [];
  const arrNoInfo: any = [];
  arr.forEach((item) => {
    if (!item?.customData?.customSize) {
      arrNoInfo.push(item);
      return;
    }

    let str = item.customData.customSize.split(/x|\*/);

    const w = parseInt(str[0]);
    const h = parseInt(str[1]);

    if (w == 2 && h == 2) {
      arr2x2.push(item);
    } else if (w == 2 && h == 4) {
      arr2x4.push(item);
    } else if (w == 4 && h == 4) {
      arr4x4.push(item);
    } else if (w == 1 && h == 1) {
      arr1x1.push(item);
    } else {
      arrSpecial.push(item);
    }
  });

  let a = [...arr2x2];
  let b = [...arr2x4];
  let c = [...arr4x4];
  let d = [...arr1x1];
  let e = [...arrSpecial];
  console.log("arr2x2 :>> ", a.length, a);
  console.log("arr2x4 :>> ", b.length, b);
  console.log("arr4x4 :>> ", c.length, c);
  console.log("arr1x1 :>> ", d.length, d);
  console.log("arrSpecial :>> ", e.length, e);
  console.log("arrNoInfo :>> ", arrNoInfo.length, arrNoInfo);

  return {
    arr2x2,
    arr2x4,
    arr4x4,
    arr1x1,
    arrSpecial,
  };
};

/**
 * 添加定位数据
 * 用于打开自由布局画布
 */
const addPositioningData = () => {
  return new Promise((resolve) => {
    let positioningId = updateCardPosition(-999, -999, {});
    setTimeout(() => {
      resolve(positioningId);
    }, 100); // 在100毫秒后返回
  });
};
// 添加卡片
const updateCardPosition = (top, left, item) => {
  const freeLayoutStore: any = useFreeLayoutStore();
  const { getFreeLayoutData } = storeToRefs(freeLayoutStore);

  let id = item?.id || nanoid(4);

  if (item.name == "notes") {
    id = item?.id || Date.now();
  }

  getFreeLayoutData.value[id] = {
    left,
    top,
    index: 1,
    id,
  };

  if (item.id) return;

  useAddCard(
    item.name,
    {
      ...item?.customData,
    },
    id
  );

  return id;
};
