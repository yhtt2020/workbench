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

const defaultOptions = {
  mainList: [],
  headerList: [],
  folderList: [],
  columns: 4,
  cb: () => {},
  test: true,
};

export const useCustomLayout = async (options) => {
  const resetLeft = () => {
    left = freeLayoutEnv.value.scrollLeft / scaleFactor + position;
    const [snappedX, snappedY] = getSnapGrid(
      [134, 96],
      left,
      top,
      getFreeLayoutState.value.canvas.width /
        getFreeLayoutState.value.canvas.zoom,
      getFreeLayoutState.value.canvas.height /
        getFreeLayoutState.value.canvas.zoom,
      6
    );
    // left = snappedX;
  };
  // 卡片数据展示
  const itemStatus = (item) => {
    if (!test) return;
    const { width, height }: any = useElementSize(item.customData.customSize);

    console.log(
      "\u001b[34m" +
        "----------------数据处理开始----------------" +
        "\u001b[0m"
    );
    console.log(
      "id :>> ",
      item?.id,
      ",name :>> ",
      item.customData.name || item.name,
      ",元素width :>> ",
      width,
      ",当前位置left :>> ",
      left - freeLayoutEnv.value.scrollLeft,
      ",当前位置缩放后left :>> ",
      left - freeLayoutEnv.value.scrollLeft / scaleFactor,
      "item",
      item
    );
  };
  // 换行数据展示
  const widthDetectionStatus = (width, res, active) => {
    if (!test) return;
    console.log(
      "\u001b[31m" + "----------------换行检测----------------" + "\u001b[0m"
    );
    console.log(
      "当前元素宽度",
      width,
      "画布宽度 :>> ",
      layoutWidth,
      "当前宽度 :>> ",
      res,
      "是否换行 :>> ",
      active
    );
  };
  // 检测是否超出
  const widthDetection = (width) => {
    let res =
      left - freeLayoutEnv.value.scrollLeft / scaleFactor - position + width;

    // const active = res > layoutWidth + columns;
    const active = res > layoutWidth;
    widthDetectionStatus(width, res, active);

    return active;
  };
  // // 设置卡片数据
  // const setData = (arr: any) => {
  //   currentHeight = 0;
  //   let last = true;
  //   // 遍历每个需要渲染的元素
  //   for (let item of arr.splice(0, arr.length)) {
  //     // 打印元素信息
  //     itemStatus(item);
  //     // 获取元素大小
  //     const { width, height }: any = useElementSize(item.customData.customSize);
  // 宽度超出容器宽度
  //     if (res > layoutWidth) {
  //       console.log("宽度超出容器宽度 :>> ");
  //       currentTop = top;
  //       // 填充空缺的数据
  //       fillGapAlgorithm();
  //       resetLeft();
  //       top += height + 12;
  //     }
  //     // 宽度等于容器宽度
  //     else if (res == layoutWidth) {
  //       console.log("宽度等于容器宽度 :>> ");
  //       addCard(top, left, item);
  //       resetLeft();
  //       top += height + 12;
  //       continue;
  //     }
  //     if (!last && height != currentHeight) {
  //       console.log(
  //         `----------------高度不相等${height - currentHeight}----------------`
  //       );
  //       // 先填充空缺的数据
  //       let res =
  //         left - freeLayoutEnv.value.scrollLeft / scaleFactor - position;
  //       currentTop += currentHeight + 12;

  //       fillHeight = currentHeight;
  //       if (res) {
  //         fillGapAlgorithm();
  //       }
  //       // 重置位置
  //       resetLeft();
  //     }
  //     // 宽度小于容器宽度
  //     addCard(top, left, item);
  //     left += width + 12;
  //     currentHeight = height;

  //     fillHeight = currentHeight;
  //     if (last) last = false;
  //   }
  //   // 循环结束
  //   currentTop = top;
  //   let res = left - freeLayoutEnv.value.scrollLeft / scaleFactor - position;
  //   if (res) {
  //     fillGapAlgorithm();
  //   }
  //   resetLeft();
  //   fillHeight = 0;
  //   top += currentHeight + 12;
  // };
  // 设置卡片数据
  const setData = (arr: any) => {
    currentHeight = 0;
    let last = true;
    for (let item of arr.splice(0, arr.length)) {
      // 处理元素位置
      const { width, height }: any = useElementSize(item.customData.customSize);
      itemStatus(item);
      // 元素超出
      let res =
        left - freeLayoutEnv.value.scrollLeft / scaleFactor - position + width;
      // 宽度等于容器宽度
      if (res == layoutWidth) {
        console.log("宽度等于容器宽度 :>> ");
        addCard(top, left, item);
        resetLeft();
        top += height + 12;
        currentTop = top;
        continue;
      } else if (res > layoutWidth) {
        console.log(
          "\u001b[31m" +
            `----------------元素超出${
              height - currentHeight
            }----------------` +
            "\u001b[0m"
        );
        currentTop = top;
        // 先填充空缺的数据
        fillGapAlgorithm();
        // 重置位置
        resetLeft();
        // 增加高度
        top += currentHeight + 12;
      }
      if (!last && height != currentHeight) {
        console.log(
          "\u001b[31m" +
            `----------------高度不相等${
              height - currentHeight
            }----------------` +
            "\u001b[0m"
        );
        // 先填充空缺的数据
        let res =
          left - freeLayoutEnv.value.scrollLeft / scaleFactor - position;
        currentTop += currentHeight + 12;
        currentHeight = height;
        console.log("元素超出 get currentHeight :>> ", currentHeight);

        fillHeight = currentHeight;
        if (res) {
          fillGapAlgorithm();
        }
        // 重置位置
        resetLeft();
        addCard(top, left, item);
        left += width + 12;
      } else {
        addCard(top, left, item);
        left += width + 12;
        currentHeight = height;
      }
      fillHeight = currentHeight;
      if (last) last = false;
      console.log(
        "\u001b[34m" +
          "----------------数据处理结束----------------" +
          "\u001b[0m"
      );
    }

    currentTop = top;

    let res = left - freeLayoutEnv.value.scrollLeft / scaleFactor - position;
    if (res) {
      fillGapAlgorithm();
    }
    resetLeft();
    fillHeight = 0;
    top += currentHeight + 12;
  };
  // 获取元素宽度
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
    }
    scaleFactor = currentZoom;
  };
  // 填充算法
  const fillGapAlgorithm = async () => {
    // 无余数
    if (arr2x4.length == 0 && arr2x2.length == 0 && arr1x1.length == 0) {
      return true;
    }
    // 无位置
    let active = widthDetection(134);
    console.log("active :>> ", active);
    if (active) {
      console.log("无位置 :>> ");
      return;
    }
    // 可以存放2x4
    if (arr2x4.length > 0 && fillHeight - 280 >= 0) {
      fill(arr2x4);
    } else if (arr2x2.length > 0) {
      fill(arr2x2);
    } else if (arr1x1.length > 0) {
      fill(arr1x1);
    } else {
      return;
    }

    fillGapAlgorithm();
  };
  // 填充实现
  const fill = async (arr, height = fillHeight) => {
    let flag = false;
    let itemWidth = 280,
      itemHeight = 204;
    for (let item of arr.splice(0, 1)) {
      if (!item) return;
      const { width, height }: any = useElementSize(item.customData.customSize);
      itemWidth = width;
      itemHeight = height;

      flag = fillHeight - itemHeight < 0;

      if (flag) {
        array.push(item);
        return;
      }
      fillHeight -= height;
      itemStatus(item);
      addCard(currentTop, left, item);
      currentTop += height + 12;
    }
    if (fillHeight - 96 < 0) {
      console.log("换列操作 :>> ");
      currentTop = top;
      left += itemWidth + 12;
      fillHeight = currentHeight;
    }
    return;
  };

  // 合并默认配置和用户配置
  const mergedOptions = _.merge({}, defaultOptions, options);
  const { mainList, headerList, folderList, columns, cb, test } = mergedOptions;

  const freeLayoutStore: any = useFreeLayoutStore();
  const { getFreeLayoutData, getFreeLayoutState, freeLayoutEnv } =
    storeToRefs(freeLayoutStore);
  getFreeLayoutState.value.canvas.height += 20000;
  getFreeLayoutState.value.canvas.width += 20000;
  getFreeLayoutState.value.system.hide = true;
  if (!getFreeLayoutState.value.system.isFreeLayout)
    getFreeLayoutState.value.system.isFreeLayout = true;

  let positioningId = await addPositioningData();
  let containerWidth = freeLayoutEnv.value.scrollWidth;
  let layoutWidth = useGridToWidth(columns * 2);
  let scaleFactor = 1;
  let position = 50;
  // 重置left坐标

  let left = 1;
  let top = freeLayoutEnv.value.scrollTop / scaleFactor + 12;
  let currentHeight;
  let currentTop = top;
  let fillHeight;

  scaleAlgorithm();
  // 初始化数据
  resetLeft();

  let { arr2x2, arr2x4, arr4x4, arr1x1, arrSpecial } = arraySplit(mainList);

  let a = [...arr2x2];
  let b = [...arr2x4];
  let c = [...arr4x4];
  let d = [...arrSpecial];
  console.log("不规则大小 :>> ", d);
  console.log("4x4 :>> ", c);
  console.log("2x4 :>> ", b);
  console.log("2x2 :>> ", a);
  let array: any = [];
  // 定制头部
  if (headerList && headerList.length) {
    let { arr2x2: header2x2, arr2x4: header2x4 } = arraySplit(headerList);
    let e = [...header2x2];
    console.log("e :>> ", e);
    let num2x2 = header2x2.length;
    currentHeight = 420;
    fillHeight = currentHeight;
    for (let index = 0; index < num2x2; index++) {
      fill(header2x2, 420);
    }
    setData(header2x4);
  }

  // 定制文件夹
  if (folderList && folderList.length) {
    let { arr2x2: folder2x2 } = arraySplit(folderList);
    resetLeft();
    setData(folder2x2);
    resetLeft();
    currentHeight = 0;
    currentTop = top;
    fillHeight = 0;
  }
  resetLeft();
  // mainList
  if (arrSpecial.length > 0) {
    setData(arrSpecial);
  }
  if (arr4x4.length > 0) {
    setData(arr4x4);
  }
  if (arr2x4.length > 0) {
    setData(arr2x4);
  }
  if (arr2x2.length > 0) {
    setData(arr2x2);
  }
  if (arr1x1.length > 0) {
    setData(arr1x1);
  }

  // 开始收尾
  useDelCard(positioningId);
  cb && cb(position);
  // resetLeft();
  // getFreeLayoutState.value.mode.align = "custom";
  // const zoom = getFreeLayoutState.value.canvas.zoom;
  // getFreeLayoutState.value.line.centerLine.y =
  //   freeLayoutEnv.value.scrollTop / scaleFactor
  // getFreeLayoutState.value.line.centerLine.x =
  //   (left - position + freeLayoutEnv.value.scrollWidth / 2) / zoom;
  // getFreeLayoutState.value.system.hide = false;
};
const arraySplit = (arr) => {
  let arr2x2: any = [];
  let arr2x4: any = [];
  let arr4x4: any = [];
  let arr1x1: any = [];
  let arrSpecial: any = [];

  console.log("拿到需要整理的数组 :>> ", arr);
  arr.forEach((item) => {
    if (!item.customData?.customSize) {
      console.log("无信息元素 item.customData :>> ", item.customData);
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
  return new Promise((resolve, reject) => {
    let positioningId = addCard(-999, -999, {});
    setTimeout(() => {
      resolve(positioningId);
    }, 100); // 在100毫秒后返回
  });
};
// 添加卡片
const addCard = (top, left, item) => {
  const freeLayoutStore: any = useFreeLayoutStore();
  const { getFreeLayoutData, getFreeLayoutState, freeLayoutEnv } =
    storeToRefs(freeLayoutStore);

  let id = item?.id || nanoid(4);

  if (item.name == "notes") {
    id = item?.id || Date.now();
  }

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
      ...item?.customData,
    },
    id
  );

  return id;
};
