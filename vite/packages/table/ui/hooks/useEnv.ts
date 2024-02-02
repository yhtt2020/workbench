import { isWeb, isClient, isMac, isOffline, isVisitor } from "./env";
import cache from "../../components/card/hooks/cache";

const priority = ["web", "offline", "visitor", "mac", "client"];

export const useEnv = (arr = "web") => {
  if (typeof arr == "string") {
    return envDetection(arr);
  }

  if (!Array.isArray(arr)) {
    return console.warn("环境检测参数必须为数组 :>> ");
  }
  arr = envSort(arr);

  let flag: any = false;

  for (const iterator of arr) {
    if (flag) return;
    flag = envDetection(iterator);
  }

  return flag;
};
const envSort = (arr) => {
  arr.sort((a, b) => {
    const indexA = priority.indexOf(a);
    const indexB = priority.indexOf(b);

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
const envDetection = (type) => {
  if (type == "web") {
    return isWeb ? "网页端" : "";
  } else if (type == "client") {
    return isClient ? "客户端" : "";
  } else if (type == "mac") {
    return isMac ? "mac端" : "";
  } else if (type == "offline") {
    return cache.get('isOffline') ? "离线模式" : "";
  } else if (type == "visitor") {
    // console.log('11111111111111111111',cache.get('isVisitor'))
    return cache.get('isVisitor') ? "游客模式" : "";
  }
};

export const useLimitEnv = (arr, name) => {
  let res = useEnv(arr);
  let limit = allLimits[res].includes(name);
  console.log("limit :>> ", limit);

  

  return limit;
};
// 路由限制
const routerLimit = {
  web: ["screen", "browser", "key"],
};
// 组件限制
const componentLimit = {
  web: ["", "", ""],
};
// 汇总所有限制
const allLimits = {
  "网页端": [...routerLimit.web, ...componentLimit.web],
  "mac端": [""],
  "客户端": [""],
  "离线模式": [""],
  "游客模式": [""],
};
