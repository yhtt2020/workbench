import cache from "../../components/card/hooks/cache";
import { appStore } from "../../store";

/**
 * 退出登录
 */
export const useLogout = () => {
  const userStore: any = appStore();
  userStore.userInfo = "";
  cache.set("ttUserToken", "");
};
