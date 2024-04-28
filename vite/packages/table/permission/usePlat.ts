import { confirm } from "../ui/new/confirm";
import cache from "../components/card/hooks/cache";

import {ALL_LIMITS, COMPONENT_LIMIT, COMPONENT_LIMIT_NAME, PRIORITY, ROUTER_LIMIT} from "./config";
import { isWeb, isWin, isMac } from "./useBaseEnv";

// 提示
const showConfirm = (name) => {
  confirm("当前平台无法使用", "请下载客户端体验完整内容。", {
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
const platSort = (arr) => {
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
const platDetection = (type) => {
  if (type == "web") {
    return isWeb ? "web" : "";
  } else if (type == "mac") {
    return isMac ? "mac" : "";
  } else if (type == "win") {
    return isWin ? "win" : "";
  }
};
// 条件判断
const checkLimit = (plat, name, options) => {
  let { msg = true, limitArr } = options;
  let res = usePlat(plat);
  let limit = limitArr[res]?.includes(name);
  if (limit && msg) {
    showConfirm(res);
  }
  return limit;
};
/*
 * 环境检测
 * 参数: web, client, mac
 * 返回: 环境名称
 */
export type basePlat = "web" | "client" | "mac";
export type usePlatType = basePlat | any;

export type usePlat = (arr: usePlatType) => basePlat;
export const usePlat: usePlat = (arr = "web") => {
  if (typeof arr == "string") {
    return platDetection(arr);
  }

  if (!Array.isArray(arr)) {
    console.warn("环境检测参数必须为数组 :>> ");
    return false;
  }

  arr = platSort(arr);

  let flag: any = false;

  for (const iterator of arr) {
    flag = platDetection(iterator);
    if (flag) return flag;
  }
};

// 全局限制实现
export const usePlatLimit = (plat, name, options = {}) => {
  return checkLimit(plat, name, { options, limitArr: ALL_LIMITS });
};
// 组件限制实现
export const useComLimit = (plat, name, options = {}) => {
  return checkLimit(plat, name, { options, limitArr: COMPONENT_LIMIT });
};

/**
 * 组件是否可在当前平台使用
 * @param name
 */
export const comCanUse=(name: string)=>{
  console.log(name,'判断')
  if (usePlat('client')) {
    return true
  } else {
    let webCanUse=[...COMPONENT_LIMIT.web.map(item => item.toLowerCase()),
      ...COMPONENT_LIMIT_NAME.web.map(item=>item.toLowerCase())]
    console.log(webCanUse)
    return !webCanUse.includes(name.toLowerCase())
  }
}
// 路由限制实现
export const useRouterLimit = (plat, name, options = {}) => {
  return checkLimit(plat, name, { options, limitArr: ROUTER_LIMIT });
};

export const currentPlat = () => {
  return usePlat(["web", "mac", "win"]);
};
