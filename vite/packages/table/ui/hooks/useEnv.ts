import { isWeb, isClient, isMac, isOffline, isVisitor } from "./env";
import { watch } from "vue";
// 权限匹配优先级
const priority = ["web", "offline", "visitor", "mac", "client"];
// 路由限制
const routerLimit = {
  web: [
    "screen",
    "browser",
    "key",
    "myGame",
    "dev",
    "music",
    "schemeIndex",
    "schemeList",
    " deck",
    "clipboard",
  ],
};
// 组件限制
const componentLimit = {
  web: ["", "", ""],
};
// 汇总所有限制
const allLimits = {
  web: [...routerLimit.web, ...componentLimit.web],
  client: [""],
  mac: [""],
  offline: [""],
  visitor: [""],
};

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
    return isWeb ? "web" : "";
  } else if (type == "client") {
    return isClient ? "client" : "";
  } else if (type == "mac") {
    return isMac ? "mac" : "";
  } else if (type == "offline") {
    return isOffline ? "offline" : "";
  } else if (type == "visitor") {
    return isVisitor ? "visitor" : "";
  }
};

export const useLimitEnv = (arr = "web", name) => {
  let res = useEnv(arr);
  let limit = allLimits[res]?.includes(name);
  console.log("limit :>> ", limit);

  return limit;
};
