import { storeToRefs } from "pinia";
import { useFreeLayoutStore } from "../../components/desk/freeLayout/store";
import { useFindDesk, useGetDesk } from "./useDesk";
// 定义参数接口
interface AddCardParams {
  name: string; // 假设name是必传的字符串类型
  data?: { [key: string]: any }; // 自定义数据，默认为空对象
  id: number | string; // id，默认为当前时间戳
  deskId?: string; // deskId，可选的字符串类型
}
/**
 *
 * @description 添加桌面卡片api
 *
 * @param name 卡片名称  必填
 * @param data 卡片数据 可选
 * @param id 卡片ID 可选
 * @param deskId 指定桌面ID 可选
 * @return id
 */
export const useAddCard = (option: AddCardParams): number | string => {
  // 解构属性，并使用默认值
  const { name = "", data = {}, id = Date.now(), deskId = "" } = option!;

  if (!name) {
    console.error("name is required");
    return -1;
  }

  // 如果有桌面id，添加到指定桌面
  if (deskId) {
    useFindDesk(deskId).cards.push({
      id,
      name,
      customData: data,
    });
  } else {
    useGetDesk().cards.push({
      name,
      id,
      customData: data,
    });
  }

  return id;
};

/**
 * @description 删除桌面卡片api
 *
 * @param cardId 卡片id 必传
 * @param deskId 桌面id 不传默认为当前桌面
 */
export const useDelCard = (cardId, deskId = null) => {
  const freeLayoutStore = useFreeLayoutStore();
  const { getCurrentDeskId, freeLayoutData }: any =
    storeToRefs(freeLayoutStore);

  // 删除自由布局数据
  delete freeLayoutData.value[getCurrentDeskId.value].cardId;

  // 删除卡片数据
  if (deskId) {
    const desk = useFindDesk(deskId);
    desk.cards = desk.cards.filter((item) => {
      return String(item.id) !== String(cardId);
    });
  } else {
    const desk = useGetDesk();

    desk.cards = desk.cards.filter((item) => {
      return String(item.id) != String(cardId);
    });
  }
};
