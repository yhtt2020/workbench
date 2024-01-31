import { isWeb, isClient, isMac, isOffline, isVisitor } from "./env";

const priority = ["web", "offline", "visitor", "client", "mac"];

export const useEnv = (arr) => {
  arr = envSort(arr);
  console.log('arr :>> ', arr);
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
    return isWeb;
  } else if (type == "client") {
    return isClient;
  } else if (type == "mac") {
    return isMac;
  } else if (type == "offline") {
    return isOffline;
  } else if (type == "visitor") {
    return isVisitor;
  }
};
