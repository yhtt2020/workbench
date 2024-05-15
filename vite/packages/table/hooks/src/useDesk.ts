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
  // const a = {
  //   name: "基础桌面23213123",
  //   nanoid: "gRxG",
  //   cards: [
  //     {
  //       name: "AIaides",
  //       id: 1715497182888,
  //       customData: {
  //         customSize: "2x2",
  //       },
  //     },

  //   ],
  //   id: "gRxG1111",
  //   settings: {
  //     cardZoom: 100,
  //     marginTop: 0,
  //     cardMargin: 5,
  //     vDirection: true,
  //     enableZoom: false,
  //   },
  //   layoutSize: {
  //     width: 1465,
  //     height: 1096,
  //   },
  // };
  // desks.value.push(a);
  return res;
};
/**
 * @description 获取桌面数据
 *
 * @param deskId 桌面id 不传时获取当前桌面
 */
export const useGetDesk = (deskId?) => {
  // 获取桌面数据
  if (deskId) {
    return useFindDesk(deskId);
  } else {
    // 获取当前桌面Id
    const home: any = homeStore();
    const { currentDeskId } = storeToRefs(home);
    return useFindDesk(currentDeskId.value);
  }
};
