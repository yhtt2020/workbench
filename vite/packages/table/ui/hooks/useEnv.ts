import { isWeb, isClient, isMac, isOffline, isVisitor } from "./env";
import { confirm } from "../new/confirm";
import cache from "../../components/card/hooks/cache";
// 权限匹配优先级
const priority = ["web", "offline", "visitor", "mac", "client"];
// 路由限制
const routerLimit = {
  web: [
    "screen",
    "apps",
    "browser",
    "key",
    "myGame",
    "dev",
    "music",
    "schemeIndex",
    "schemeList",
    " deck",
    "clipboard",
    "barrage",
    "shortcut",
    "note",
  ],
};
// 组件限制
const componentLimit = {
  web: [],
};
// 汇总所有限制
const allLimits = {
  网页端: [...routerLimit.web, ...componentLimit.web],
  mac端: [""],
  客户端: [""],
  离线模式: [""],
  游客模式: [""],
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
    if (flag) return flag;
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
    return cache.get("isOffline") ? "离线模式" : "";
  } else if (type == "visitor") {
    return cache.get("isVisitor") ? "游客模式" : "";
  }
};

export const useLimitEnv = (arr, name, msg = true) => {
  let res = useEnv(arr);
  let limit = allLimits[res]?.includes(name);
  console.log("allLimits[res] :>> ", allLimits[res]);
  console.log("limit :>> ", limit);
  if (limit && msg) {
    confirm(res + "无法使用", "下载客户端体验完整内容。", {
      noText: "稍后再说",
      okText: "立即下载",
      ok: () => {
        window.open("https://www.apps.vip/download/");
      },
      okButtonWidth: "95",
      noButtonWidth: "95",
    });
  }
  return limit;
};
