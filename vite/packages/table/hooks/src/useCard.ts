import { storeToRefs } from "pinia";
import { useFreeLayoutStore } from "../../components/desk/freeLayout/store";
import { useGetDesk } from "./useDesk";
import {nanoid} from "nanoid";
// 定义参数接口
interface AddCardParams {
  name: string; // 假设name是必传的字符串类型
  data?: { [key: string]: any }; // 自定义数据，默认为空对象
  id?: number | string; // id，默认为当前时间戳
  deskId?: string; // deskId，可选的字符串类型
}
/**
 * 添加桌面卡片的 API 函数。
 *
 * @param name 卡片名称（必填）
 * @param data 卡片数据（可选）
 * @param id 卡片ID（可选），如果提供，则更新指定ID的卡片
 * @param deskId 指定桌面ID（可选），用于将卡片添加到特定的桌面
 * @returns 添加或更新后的卡片ID
 */
export const useAddCard = (option: AddCardParams): number | string => {
  // 解构属性，并使用默认值
  const { name = "", data = {}, id = nanoid(4), deskId = "" } = option!;

  if (!name) {
    console.error("name is required");
    return -1;
  }

  // 添加到桌面
  useGetDesk(deskId).cards.push({
    id,
    name,
    customData: data,
  });

  return id;
};

/**
 * @description 删除桌面卡片api
 *
 * @param cardId 卡片id 必传
 * @param deskId 桌面id 不传默认为当前桌面
 */
export const useDelCard = (cardId, deskId?) => {
  const freeLayoutStore = useFreeLayoutStore();
  const { getCurrentDeskId, freeLayoutData }: any =
    storeToRefs(freeLayoutStore);

  // 删除自由布局数据
  if (deskId) {
    delete freeLayoutData.value[deskId].cardId;
  } else {
    delete freeLayoutData.value[getCurrentDeskId.value].cardId;
  }

  // 删除卡片数据
  let desk = useGetDesk(deskId);

  console.log('1desk :>> ', desk);
  desk.cards = desk.cards.filter((item) => {
    return String(item.id) !== String(cardId);
  });
  console.log('2desk :>> ', desk);

};
