import { storeToRefs } from "pinia";
import { useTTAppStore } from "../../../../../ttApp/src/store";
import { useDelCard } from "../../../../../../hooks";
import { navStore as useNavStore } from "../../../../../../store/nav";
import { message } from "ant-design-vue";
export const validate = (id: string) => {
  const ttappStore: any = useTTAppStore();
  return ttappStore.select(id);
};

export const cardValidate = (cardId: any, id: string) => {
  let res = validate(id);
  if (res) {
    return res;
  }

  useDelCard(cardId);
  return false;
};
export const navValidate = (navId: any, id: string) => {
  let res = validate(id);
  if (res) {
    return res;
  }
  // 获取导航数据
  const navStore = useNavStore();
  const { copyFootNav, sideNavigationList, rightNavigationList }: any =
    storeToRefs(navStore);

  // 过滤底部导航栏
  copyFootNav.value = copyFootNav.value.filter((data: any) => {
    if (data.id == navId) {
      return false;
    }
    return true;
  });
  // 过滤左边导航栏
  sideNavigationList.value = sideNavigationList.value.filter((data: any) => {
    if (data.id == navId) {
      return false;
    }
    return true;
  });
  // 过滤右边导航栏
  rightNavigationList.value = rightNavigationList.value.filter((data: any) => {
    if (data.id == navId) {
      return false;
    }
    return true;
  });
  message.success("应用不存在，已帮您删除");
  return false;
};
