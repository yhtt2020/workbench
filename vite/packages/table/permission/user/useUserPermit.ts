import cache from "../../components/card/hooks/cache";
import { appStore } from "../../store";
import { chatStore } from "../../store/chat";

import { useEnv } from "../useEnv";
import { getUserInfo } from "../api/login";
import { useLogout } from "./useLogout";
import { setLV } from "./useUtils";

/**
 * 用户许可
 */
export const useUserPermit = async () => {
  // 1.1、获取新版token存储
  let token = cache.get("ttUserToken");

  // 1.2、新版token不存在 获取旧版token存储
  if (!token && !useEnv("web")) {
    let res = await window.tsbApi.user.get();
    token = res.data.token;
  }
  // 2、有token
  if (token) {
    // 2.1、设置用户信息
    let res = await setUserInfo();

    // 2.2、设置成功
    if (res) {
      return res;
    }
  }
  // 没token 或者 没用户信息
  useLogout();
  return false;
};

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
  console.time("UserInfo Run Time");

  let res = await getUserInfo();
  console.timeEnd("UserInfo Run Time");

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
