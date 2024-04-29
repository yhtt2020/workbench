import { storeToRefs } from "pinia";
import { computed } from "vue";
import { usePermissionStore } from "../../permission/store";
// 环境优先级排序
export const PRIORITY = ["single", "offline", "guest", "online"];
const envSort = (arr: string | string[]) => {
  if (typeof arr == "string") {
    return [arr];
  }

  arr.sort((a, b) => {
    const indexA = PRIORITY.indexOf(a);
    const indexB = PRIORITY.indexOf(b);

    if (indexA === -1 && indexB === -1) {
      return 0;
    } else if (indexA === -1) {
      return 1;
    } else if (indexB === -1) {
      return -1;
    } else {
      return indexA - indexB;
    }
  });

  return arr;
};
export const useStatus = () => {
  const permissionStore: any = usePermissionStore();
  const { isOffline, isSingle, isGuest } = storeToRefs(permissionStore);
  const status = computed(() => {
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

  const validate = (arr?: string | string[]) => {
    return computed(() => {
      if (!arr) {
        console.log("未传递arr参数 :>> ");
        return;
      }
      let activeStatus: any = false;
      arr = envSort(arr);
      // 环境判断
      const statusValidate = (status: string) => {
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
      for (const status of arr) {
        activeStatus = statusValidate(status);
        if (activeStatus) return activeStatus;
      }
      console.log("activeStatus :>> ", activeStatus);
      return activeStatus;
    });
  };
  return {
    setGuest: permissionStore.setGuest,
    setSingle: permissionStore.setSingle,
    setOffline: permissionStore.setOffline,
    status,
    validate,
  };
};
const status = () => {};
