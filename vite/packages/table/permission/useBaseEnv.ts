import cache from "../components/card/hooks/cache";
/**
 * @returns 当前所属环境
 */
const getCurrentEnv = () => {
  const userAgent = navigator.userAgent;
  if (
    userAgent.indexOf("天天工作台") > -1 &&
    userAgent.indexOf("Windows") > -1
  ) {
    return "win";
  } else if (
    userAgent.match(
      /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
    )
  ) {
    return "mobile";
  } else if (userAgent.indexOf("Mac") > -1) {
    return "mac";
  }
  return "web";
};

const getWebEnv = () => {
  return currentEnv === "web" ? true : false;
};

const getWindowEnv = () => {
  return currentEnv === "win" ? true : false;
};

const getMacEnv = () => {
  return currentEnv === "mac" ? true : false;
};

const getOffline = () => {
  return cache.get("isOffline") ? true : false;
};

const getGuest = () => {
  return cache.get("isGuest") ? true : false;
};
const getMobileEnv = () => {
  return currentEnv === "mobile" ? true : false;
};

const currentEnv = getCurrentEnv();
const isWeb = getWebEnv();
const isWindow = getWindowEnv();
const isMac = getMacEnv();
const isMobile = getMobileEnv();
const isOffline = getOffline();
const isGuest = getGuest();
// const xttoken
export default currentEnv;

export { isWeb, isWindow, isMac, isMobile, isOffline, isGuest };
