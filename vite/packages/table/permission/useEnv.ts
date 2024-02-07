import { confirm } from "../ui/new/confirm";
import cache from "../components/card/hooks/cache";

import { ALL_LIMITS, COMPONENT_LIMIT, PRIORITY, ROUTER_LIMIT } from "./config";
import { isWeb, isWindow, isMac, isOffline, isGuest } from "./useBaseEnv";

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
const envSort = (arr) => {
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
const envDetection = (type) => {
  if (type == "web") {
    return isWeb ? "web" : "";
  } else if (type == "mac") {
    return isMac ? "mac" : "";
  } else if (type == "offline") {
    return cache.get("isOffline") ? "offline" : "";
  } else if (type == "guest") {
    return cache.get("isGuest") ? "guest" : "";
  } else if (type == "window") {
    return isWindow ? "window" : "";
  }
};
// 条件判断
const checkLimit = (env, name, options) => {
  let { msg = true, limitArr } = options;
  let res = useEnv(env);
  let limit = limitArr[res]?.includes(name);
  if (limit && msg) {
    showConfirm(res);
  }
  return limit;
};
/*
  环境检测
  参数: web, client, mac, offline, guest
  返回: 环境名称
*/
export const useEnv = (arr = "web") => {
  if (typeof arr == "string") {
    return envDetection(arr);
  }

  if (!Array.isArray(arr)) {
    console.warn("环境检测参数必须为数组 :>> ");
    return false;
  }

  arr = envSort(arr);

  let flag: any = false;

  for (const iterator of arr) {
    flag = envDetection(iterator);
    if (flag) return flag;
  }
};
// 全局限制实现
export const useEnvLimit = (env, name, options = {}) => {
  return checkLimit(env, name, { ...options, limitArr: ALL_LIMITS });
};
// 组件限制实现
export const useComLimit = (env, name, options = {}) => {
  return checkLimit(env, name, { ...options, limitArr: COMPONENT_LIMIT });
};
// 路由限制实现
export const useRouterLimit = (env, name, options = {}) => {
  return checkLimit(env, name, { ...options, limitArr: ROUTER_LIMIT });
};
