import { confirm } from "../ui/new/confirm";
import cache from "../components/card/hooks/cache";

import { ALL_LIMITS, COMPONENT_LIMIT, PRIORITY, ROUTER_LIMIT } from "./config";
import { isH5, isWindow, isMac } from "./useBaseEnv";

// 提示
const showConfirm = (name) => {
  confirm(name + "无法使用", "下载客户端体验完整内容。", {
    noText: "稍后再说",
    okText: "立即下载",
    ok: () => {
      window.open("https://www.apps.vip/download/");
    },
    okButtonWidth: "95",
    noButtonWidth: "95",
  });
};
// 环境优先级排序
const devSort = (arr) => {
  arr.sort((a, b) => {
    const indexA = PRIORITY.indexOf(a);
    const indexB = PRIORITY.indexOf(b);

    if (indexA === -1 && indexB === -1) {
      return 0;
    } else if (indexA === -1) {
      return 1;
    } else if (indexB === -1) {
      return -1;
    } else {
      return indexA - indexB;
    }
  });

  return arr;
};
// 环境判断
const devDetection = (type) => {
  if (type == "h5") {
    return isH5 ? "h5" : "";
  } else if (type == "mac") {
    return isMac ? "mac" : "";
  } else if (type == "window") {
    return isWindow ? "window" : "";
  }
};
// 条件判断
const checkLimit = (dev, name, options) => {
  let { msg = true, limitArr } = options;
  let res = useDev(dev);
  let limit = limitArr[res]?.includes(name);
  if (limit && msg) {
    showConfirm(res);
  }
  return limit;
};
/*
 * 环境检测
 * 参数: h5, client, mac
 * 返回: 环境名称
 */
export type baseDev = "h5" | "client" | "macOS";
export type useDevType = baseDev | any;

export type UseDev = (arr: useDevType) => baseDev;
export const useDev: UseDev = (arr = "h5") => {
  if (typeof arr == "string") {
    return devDetection(arr);
  }

  if (!Array.isArray(arr)) {
    console.warn("环境检测参数必须为数组 :>> ");
    return false;
  }

  arr = devSort(arr);

  let flag: any = false;

  for (const iterator of arr) {
    flag = devDetection(iterator);
    if (flag) return flag;
  }
};

// 全局限制实现
export const useDevLimit = (dev, name, options = {}) => {
  return checkLimit(dev, name, { options, limitArr: ALL_LIMITS });
};
// 组件限制实现
export const useComLimit = (dev, name, options = {}) => {
  return checkLimit(dev, name, { options, limitArr: COMPONENT_LIMIT });
};
// 路由限制实现
export const useRouterLimit = (dev, name, options = {}) => {
  return checkLimit(dev, name, { options, limitArr: ROUTER_LIMIT });
};

export const currentDev = () => {
  return useDev(["h5", "mac", "window"]);
};
