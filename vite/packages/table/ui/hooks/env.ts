/**
 * @returns 当前所属环境
 */
 import cache from "../../components/card/hooks/cache";
const getCurrentEnv = () => {
  const userAgent = navigator.userAgent;
  if (
    userAgent.indexOf("天天工作台") > -1 &&
    userAgent.indexOf("Windows") > -1
  ) {
    return "windows";
  } else if (
    userAgent.match(
      /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
    )
  ) {
    return "mobile";
  } else if (userAgent.indexOf("Mac") > -1) {
    return "macOS";
  }
  return "h5";
};

const getH5Env = () => {
  return currentEnv === "h5" ? true : false;
};

const getWindowsEnv = () => {
  return currentEnv === "windows" ? true : false;
};

const getMacOSEnv = () => {
  return currentEnv === "macOS" ? true : false;
};

const getOffline = () => {
  return cache.get('isOffline') ? true : false;
}

const getGuest = () => {
  return cache.get('isGuest') ? true : false;
}

const getSingle = () => {
  return cache.get('isSingle') ? true : false;
}
const currentEnv = getCurrentEnv();
const isH5 = getH5Env();
const isWindows = getWindowsEnv();
const isMacOS = getMacOSEnv();
const isOffline = getOffline();
const isGuest = getGuest();
const isSingle = getSingle();

export default currentEnv;

export { isH5, isWindows, isMacOS, isOffline, isGuest, isSingle };
