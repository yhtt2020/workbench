import cache from "../../components/card/hooks/cache";
import { appStore } from "../../store";
import { chatStore } from "../../store/chat";

import { useEnv } from "../useEnv";
import { getUserInfo } from "../api/login";
import { useLogout, useClearUserInfo } from "./useLogout";
import { setLV } from "./useUtils";
import { usePermissionStore } from "../store";
import { storeToRefs } from "pinia";
/**
 * 用户许可
 */
export const useUserPermit = async () => {
  const permissionStore = usePermissionStore();
  const { retrievedOldTokenFlag } = storeToRefs(permissionStore);
  // 1、 获取token
  // 1.1、获取新版token存储
  let token = cache.get("ttUserToken");
  // 1.2、新版token存在 标记已取过旧版token
  if (token) {
    // 标记取过旧版token
    retrievedOldTokenFlag.value = true;
  }
  // 1.3、未取过旧版token 并且 不处于web端
  if (!retrievedOldTokenFlag.value && !useEnv("web")) {
    let res = await (window as any).tsbApi.user.get();
    token = res?.data?.token;
    // 标记取过旧版token
    retrievedOldTokenFlag.value = true;
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
  console.time("UserInfo Run Time");
  // 数据请求
  let res = await getUserInfo();

  console.timeEnd("UserInfo Run Time");

  // 验证状态
  const { code, data } = res || {};
  if (res.code !== 1000 && code !== 200) {
    useClearUserInfo();
    console.log("登录时错误信息 :>> ", res);
    return;
  }
  let userData = data.data;

  // 旧版本用户信息处理逻辑
  setLV(userData);

  // 获取头像框信息
  // let response = await userStore.getUserCard(userData.uid);
  // userData.frame = response.data.frame;
  // userStore.userInfo = userData;

  // 社区登录
  (chatStore() as any)?.login();

  return userData;
};
