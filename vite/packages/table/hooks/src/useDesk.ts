import { storeToRefs } from "pinia";
import { cardStore as useCardStore } from "../../store/card";
import { homeStore } from "../../store/home";

/**
 * @description 查找指定桌面
 * @param deskId 桌面id
 */
export const useFindDesk = (deskId: string) => {
  // 获取所有桌面
  const cardStore: any = useCardStore();
  const { desks } = storeToRefs(cardStore);

  // 查找指定桌面
  let res = desks.value.find((item) => {
    if (item.id == deskId) return item;
  });

  return res;
};
/**
 * @description 获取当前桌面数据
 *
 * @param deskId 桌面id 可选
 */
export const useGetDesk = (deskId?) => {
  // 获取当前桌面数据
  if (deskId) {
    return useFindDesk(deskId);
  } else {
    // 获取当前桌面Id
    const home: any = homeStore();
    const { currentDeskId } = storeToRefs(home);
    return useFindDesk(currentDeskId.value);
  }
};


