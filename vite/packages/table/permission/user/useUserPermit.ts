import cache from "../../components/card/hooks/cache";
import { appStore } from "../../store";
import { chatStore } from "../../store/chat";

import { useEnv } from "../useEnv";
import { getUserInfo } from "../api/login";
import { useLogout } from "./useLogout";
import { setLV } from "./useUtils";
/**
 * 获取用户信息
 */
const setUserInfo = async () => {
  const userStore: any = appStore();
  // 先判断用户信息是否存在，不存在进行赋值
  if (userStore.userInfo) return userStore.userInfo;
  return await useUpdateUserInfo();
};

/**
 * 更新用户信息
 */
export const useUpdateUserInfo = async () => {
  const userStore: any = appStore();
  let res = await getUserInfo();
  // 旧版本用户信息处理逻辑
  let res1 = setLV(res.data);
  if (!res1) {
    useLogout();
    return;
  }

  let userData = res.data.data;
  // 获取头像框信息
  // let response = await userStore.getUserCard(userData.uid);
  // userData.frame = response.data.frame;
  // userStore.userInfo = userData;
  // 社区登录
  chatStore()?.login();
  return userData;
};
/**
 * 用户许可
 */
export const useUserPermit = async () => {
  let token = cache.get("ttUserToken");

  // 兼容旧版本tsbApi获取token方案
  if (!token && !useEnv("web")) {
    let res = await window.tsbApi.user.get();
    token = res.data.token;
    cache.set("ttUserToken", token);
  }
  // 有token
  if (token) {
    let res = await setUserInfo();
    return res;
  }
  // 没token
  useLogout();
  return false;
};
