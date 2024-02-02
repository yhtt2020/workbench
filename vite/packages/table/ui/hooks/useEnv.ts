import { isWeb, isClient, isMac, isOffline, isVisitor } from "./env";

const priority = ["web", "offline", "visitor", "mac", "client"];

let plat;

export const useEnv = (arr) => {
  if (typeof arr == "string") {
    return envDetection(arr)?plat:false;
  }

  if (!Array.isArray(arr)) {
   return console.warn('环境检测参数必须为数组 :>> ');
  }
  arr = envSort(arr);

  let flag: any = false;

  for (const iterator of arr) {
    flag = envDetection(iterator);
    if(flag) return plat
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
    plat = '网页端'
    return isWeb;
  } else if (type == "client") {
    plat = '客户端'
    return isClient;
  } else if (type == "mac") {
    plat = '苹果端'
    return isMac;
  } else if (type == "offline") {
    plat = '离线模式'
    return isOffline;
  } else if (type == "visitor") {
    plat = '游客模式'
    return isVisitor;
  }
};