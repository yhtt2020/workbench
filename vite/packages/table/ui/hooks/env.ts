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
    return "client";
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

const getClientEnv = () => {
  return currentEnv === "client" ? true : false;
};

const getMacEnv = () => {
  return currentEnv === "mac" ? true : false;
};

const currentEnv = getCurrentEnv();
const isWeb = getWebEnv();
const isClient = getClientEnv();
const isMac = getMacEnv();
const isOffline = cache.get('isOffline')

export default currentEnv;

export { isWeb, isClient, isMac, isOffline };


module.exports = {
  currentEnv,
  isWeb,
  isClient,
  isMac,
  isOffline,
};
