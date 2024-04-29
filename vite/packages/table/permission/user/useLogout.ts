import cache from "../../components/card/hooks/cache";
import { appStore } from "../../store";
import { useToast } from "vue-toastification";
import { ChatLogout } from "../../apps/chat/hooks/chat";
import { usePermissionStore } from "../store";
/**
 * 退出登录
 */
export const useLogout = () => {
  const userStore: any = appStore();
  const permissionStore: any = usePermissionStore();
  // 清空用户信息
  userStore.userInfo = "";
  permissionStore.setGuest(true);
  // 清空本地 token
  cache.set("ttUserToken", "");
  // 退出群聊
  new ChatLogout().logout();
};

export const useClearUserInfo = () => {
  const toast = useToast();
  toast.success("用户信息丢失 触发清空操作");
};
