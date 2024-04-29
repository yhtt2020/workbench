import { storeToRefs } from "pinia";
import { computed } from "vue";
import { usePermissionStore } from "../../permission/store";
// 环境优先级排序
export const PRIORITY = ["single", "offline", "guest", "online"];
type Status = "single" | "offline" | "guest" | "online";

/**
 * 状态管理
 */
export const useStatus = () => {
  const permissionStore: any = usePermissionStore();
  const { isOffline, isSingle, isGuest } = storeToRefs(permissionStore);
  /**
   * 当前状态
   * 优先级排序：单机 > 离线 > 游客 > 在线
   */
  const status = computed((): Status => {
    if (isSingle.value) {
      return "single";
    }
    if (isOffline.value) {
      return "offline";
    }
    if (isGuest.value) {
      return "guest";
    }

    return "online";
  });

  /** 校验
   * @param arr 传入一个或多个状态，只要有一个状态符合条件，即返回true
   */
  const validate = (arr: Status | Status[]) => {
    return computed(() => {
      if (!arr) {
        console.warn("未传递arr参数 :>> ");
        return false;
      }
      let activeStatus: boolean = false;
      // 如果arr是一个字符串，将其转换为数组
      const statuses = Array.isArray(arr) ? arr : [arr];
      // 环境判断
      const statusValidate = (status: Status) => {
        switch (status) {
          case "single":
            return isSingle.value;
          case "offline":
            return isOffline.value;
          case "guest":
            return isGuest.value;
          default:
            return true;
        }
      };
      for (const status of statuses) {
        activeStatus = statusValidate(status);
        if (activeStatus) return activeStatus;
      }

      return activeStatus;
    });
  };

  /** 设置游客状态 */
  const setGuest = (flag: boolean) => permissionStore.setGuest(flag);
  /** 设置单机状态 */
  const setSingle = (flag: boolean) => permissionStore.setSingle(flag);
  /** 设置离线状态 */
  const setOffline = (flag: boolean) => permissionStore.setOffline(flag);
  return {
    setGuest,
    setSingle,
    setOffline,
    status,
    validate,
  };
};
