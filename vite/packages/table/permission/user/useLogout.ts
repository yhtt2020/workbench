import cache from "../../components/card/hooks/cache";
import { appStore } from "../../store";
import { usePermissionStore } from "../store";
import { useToast } from "vue-toastification";
/**
 * 退出登录
 */
export const useLogout = () => {
  const userStore: any = appStore();
  const permissionStore = usePermissionStore();
  // 清空用户信息
  userStore.userInfo = "";
  // 清空pinia token
  permissionStore.token = "";
  // 清空本地 token
  cache.set("ttUserToken", "");
  // 清除群聊登录
  (window as any).$chat?.chat?.logout();
};

export const useClearUserInfo = () => {
  useLogout();
  console.log("触发用户数据清空 :>> ");
  const toast = useToast();
  toast.success("用户信息丢失 触发清空操作");
};
