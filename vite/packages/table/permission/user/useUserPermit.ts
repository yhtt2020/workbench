import cache from "../../components/card/hooks/cache";
import { appStore } from "../../store";
import { chatStore } from "../../store/chat";

import { getUserInfo } from "../api/login";
import { useLogout, useClearUserInfo } from "./useLogout";
import { setLV } from "./useUtils";
import { usePermissionStore } from "../store";

import { updateLogin } from "../../apps/chat/hooks/chat";

// 检查当前网络状态
import { useNetwork } from "@vueuse/core";
import { message } from "ant-design-vue";

const { isOnline } = useNetwork();

/**
 * 用户许可
 */
export const useUserPermit = async () => {
  const permissionStore: any = usePermissionStore();
  // 0
  if (!isOnline.value) {
    permissionStore.setOffline(true);
    return;
  } else {
    permissionStore.setOffline(false);
    if (window.$useEnv("offline")) {
      message.warning("当前网络不佳，请稍后重试！");
      return;
    }
  }
  // 1、 获取token
  let token = cache.get("ttUserToken");

  // 2、有token
  if (token) {
    // 2.1、设置用户信息
    let res = await setUserInfo();

    // 2.2、设置成功
    if (res) {
      // 清楚游客模式
      permissionStore.setGuest(false);
      return res;
    }
  }
  // console.log('object :>> ', object);
  useLogout();
  return false;
};

/**
 * 获取用户信息
 */
const setUserInfo = async () => {
  const userStore: any = appStore();

  // 有用户信息
  if (userStore.userInfo) {
    //补充聊天登录逻辑
    (chatStore() as any)?.login();
    return userStore.userInfo;
  }
  // 无用户信息发送请求
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
    // permissionStore.setOffline(true);
    message.warning("当前网络不佳，请稍后重试！");
    console.log("登录时错误信息 :>> ", res);
    return;
  }
  // 4 请求成功
  console.log("请求成功 :>> ");

  if (permissionStore.currentEnv == "offline") {
    message.success("重新上线成功！");
  }

  permissionStore.setOffline(false);

  let userData = data.data;
  // 旧版本用户信息处理逻辑
  setLV(userData);

  // 获取头像框信息
  // let response = await userStore.getUserCard(userData.uid);
  // userData.frame = response.data.frame;
  // userStore.userInfo = userData;

  // 社区登录
  (chatStore() as any)?.login();
  /**更新社群和群聊**/
  updateLogin();

  return userData;
};

/**
 * 打开重连弹窗
 */
export const reconnect = async () => {
  /**提示重连弹窗**/
  window.$ui.confirm("提示", "目前处于离线模式，请重连后体验完整功能。", {
    ok: () => {
      useUpdateUserInfo();
    },
    okText: "立即重连",
    noText: "暂不连接",
    type: "warning",
    okButtonWidth: "95",
    noButtonWidth: "95",
  });
};
