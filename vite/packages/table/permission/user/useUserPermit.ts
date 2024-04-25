import cache from "../../components/card/hooks/cache";
import { appStore } from "../../store";
import { chatStore } from "../../store/chat";


import { getUserInfo } from "../api/login";
import { useLogout, useClearUserInfo } from "./useLogout";
import { setLV } from "./useUtils";
import { usePermissionStore } from "../store";
// import { storeToRefs } from "pinia";
/**
 * 用户许可
 */
export const useUserPermit = async () => {
  const permissionStore = usePermissionStore();
  // 1、 获取token
  let token = cache.get("ttUserToken");

  // 2、有token
  if (token) {
    // 2.1、设置用户信息
    let res = await setUserInfo();

    // 2.2、设置成功
    if (res) {
      return res;
    }
    // 离线模式
    if(permissionStore.isOffline) {
      return;
    }else{
      // 没token 或者 没用户信息
      useLogout();
    }
  }
  return false;
};

/**
 * 获取用户信息
 */
const setUserInfo = async () => {
  const userStore: any = appStore();
  // const permissionStore = usePermissionStore();
  // 先判断用户信息是否存在，不存在进行赋值
  // if (permissionStore.userInfo) {
  //   setLV(permissionStore.userInfo);
  //   return;
  // } else
   if (userStore.userInfo) {
    return userStore.userInfo;
  }

  console.log("useUpdateUserInfo :>> ", useUpdateUserInfo);
  return await useUpdateUserInfo();
};

/**
 * 更新用户信息 重连
 */
export const useUpdateUserInfo = async () => {
  const permissionStore = usePermissionStore();
  // 1 获取用户信息
  console.time("UserInfo Run Time");

  let res = await getUserInfo();

  console.timeEnd("UserInfo Run Time");

  // 2 验证状态
  const { code, data } = res || {};
  console.log("res11111111111111111111111111111111 :>> ", res);
  // 3 请求失败
  if (res.code !== 1000 && code !== 200) {
    useClearUserInfo();
    // 修改为离线状态
    permissionStore.setOffline(true);
    console.log("登录时错误信息 :>> ", res);
    return;
  }
  // 4 请求成功
  console.log("请求成功 :>> ");
  permissionStore.setOffline(false);
  permissionStore.setGuest(false);

  let userData = data.data;
  // const permissionStore = usePermissionStore();
  // permissionStore.userInfo = userData;
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
