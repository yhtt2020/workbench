import cache from "../../components/card/hooks/cache";
import { appStore } from "../../store";
import { usePermissionStore } from "../store";
import { useToast } from "vue-toastification";
import { chatLogout } from "../../apps/chat/hooks/chat";
/**
 * 退出登录
 */
export const useLogout = () => {
  const userStore: any = appStore();
  // const permissionStore:any = usePermissionStore();
  // 清空用户信息
  userStore.userInfo = "";
  // 清空pinia token
  // permissionStore.token = "";
  // permissionStore.userInfo = "";
  // 清空本地 token
  cache.set("ttUserToken", "");
  // 退出群聊
  chatLogout();
};

export const useClearUserInfo = () => {
  const toast = useToast();
  toast.success("用户信息丢失 触发清空操作");
};
