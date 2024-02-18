import { message } from "ant-design-vue";
import _ from "lodash";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { useElementSize } from "../../../ui/hooks/useCardSize";
import { useFreeLayoutStore } from "../freeLayout/store";
// 裁切画布
const defaultConfig = {
  redirect: false,
  id: null,
  item: {},
  position: 0,
  currentData: {},
  proxy: null,
};
const loading = ref(false);
export const useCutLayout = async (config) => {
  console.log("--------------- 处理画布开始 ---------------");
  console.time("Free Layout Run Time");
  // 前置代码 新功能请在后面添加

  const mergedOptions = _.merge({}, defaultConfig, config);
  const { redirect, id, item, position, currentData, proxy } = mergedOptions;
  const freeLayoutStore: any = useFreeLayoutStore();
  const { getFreeLayoutData, getFreeLayoutState, freeLayoutEnv } =
    storeToRefs(freeLayoutStore);
  if (!getFreeLayoutState.value.canvas.autoExtend) return;

  if (redirect) {
    loading.value = true;
  }

  let left: any = Infinity;
  let top: any = Infinity;
  let right: any = 0;
  let bottom: any = 0;

  let rightItem: any = {};
  let bottomItem: any = {};
  let leftItem: any = {};
  let topItem: any = {};

  let currentLeft = 0;
  let currentTop = 0;
  let currentRight = 0;
  let currentBottom = 0;

  if (id) {
    let size = currentData?.value[id]?.customData?.customSize;
    let width = 0;
    let height = 0;
    if (size) {
      let sizeObj = useElementSize(size);
      width = sizeObj.width;
      height = sizeObj.height;
    }
    currentTop = item.top;
    currentLeft = item.left;
    currentRight = item.left + width;
    currentBottom = item.top + height;
  }
  let width = 0;
  let height = 0;
  // 找最大最小元素
  Object.values(getFreeLayoutData.value).forEach((item: any) => {
    if (item.top < top) {
      top = item.top;
      topItem = item;
    }

    if (item.left < left) {
      left = item.left;
      leftItem = item;
    }

    let size = currentData?.value[item.id]?.customData?.customSize;

    if (size) {
      let sizeObj = useElementSize(size);
      width = sizeObj.width;
      height = sizeObj.height;
    }

    if (item.left + width > right) {
      right = item.left + width;
      rightItem = item;
    }
    if (item.top + height > bottom) {
      bottom = item.top + height;
      bottomItem = item;
    }
  });

  // 获取画布大小
  let { width: canvasWidth, height: canvasHeight } =
    getFreeLayoutState.value.canvas;
  // 获取当前窗口大小
  let { scrollHeight, scrollWidth } = freeLayoutEnv.value;
  // 比例
  const HEIGHT_PROPORTION = 0.8;
  const WIDTH_PROPORTION = 0.5;
  // 当前屏幕宽度
  const viewWidth = scrollWidth * WIDTH_PROPORTION;
  const viewHeight = scrollHeight * HEIGHT_PROPORTION;
  /**
   * @description: 空白画布回收
   */
  let msgArr: any = [];

  // 左边
  if (redirect || currentLeft == left) {
    if (left < viewWidth) {
      let diff = viewWidth - left;
      getFreeLayoutData.value = Object.values(getFreeLayoutData.value).map(
        (item: any) => {
          item.left += diff;
          return item;
        }
      );
      msgArr.push("左边");
      getFreeLayoutState.value.canvas.width += diff;
    } else if (left > viewWidth) {
      let diff = left - viewWidth;
      getFreeLayoutData.value = Object.values(getFreeLayoutData.value).map(
        (item: any) => {
          item.left -= diff;
          return item;
        }
      );
      msgArr.push("左边");
      getFreeLayoutState.value.canvas.width -= diff;
    }
  }
  // 上边
  if (redirect || currentTop == top) {
    if (top < viewHeight) {
      let diff = viewHeight - top;
      getFreeLayoutData.value = Object.values(getFreeLayoutData.value).map(
        (item: any) => {
          item.top += diff;
          return item;
        }
      );
      msgArr.push("上边");
      getFreeLayoutState.value.canvas.height += diff;
    } else if (top > viewHeight) {
      let diff = top - viewHeight;
      getFreeLayoutData.value = Object.values(getFreeLayoutData.value).map(
        (item: any) => {
          item.top -= diff;
          return item;
        }
      );
      msgArr.push("上边");
      getFreeLayoutState.value.canvas.height -= diff;
    }
  }
  // 右边
  if (redirect || currentRight == right) {
    if (canvasWidth - right < viewWidth) {
      msgArr.push("右边");
      getFreeLayoutState.value.canvas.width = right + viewWidth;
    } else if (canvasWidth - right > viewWidth) {
      msgArr.push("右边");
      getFreeLayoutState.value.canvas.width = right + viewWidth - width;
    }
  }
  // 下边
  if (redirect || currentBottom == bottom) {
    if (canvasHeight - bottom < viewHeight) {
      msgArr.push("下边");
      getFreeLayoutState.value.canvas.height = bottom + viewHeight;
    } else if (canvasHeight - bottom > viewHeight) {
      getFreeLayoutState.value.canvas.height = bottom + viewHeight - height;
      msgArr.push("下边");
    }
  }

  if (msgArr.length > 0) {
    message.success("已为您更新画布画布");
  }
  console.log("被调用了 :>> ");
  // 处于吸附网格
  // if (getFreeLayoutState.value.mode.arrange == "grid") {
  //   snowDrag.value?.forEach((item) => {
  //     item.adsorbGrid();
  //   });
  // }
  loading.value = false;
  getFreeLayoutState.value.system.hide = false;

  console.log("redirect :>> ", redirect);
  if (!redirect) return;
  // setTimeout(() => {
  getFreeLayoutState.value.mode.align = "custom";
  const zoom = getFreeLayoutState.value.canvas.zoom;
  getFreeLayoutState.value.line.centerLine.y = top - 12;
  getFreeLayoutState.value.line.centerLine.x =
    (left - position + scrollWidth / 2) / zoom;
    console.log('proxy :>> ', proxy);
  // proxy.$bus.emit("restoreLocation");
  loading.value = false;
  console.timeEnd("Free Layout Run Time");
    console.log("--------------- 处理画布结束 ---------------");
  // }, 500);
};
