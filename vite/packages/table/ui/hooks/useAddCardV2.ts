// 添加桌面卡片api
import { storeToRefs } from "pinia";
import { useFreeLayoutStore } from "../../components/desk/freeLayout/store";
import { cardStore as useCardStore } from "../../store/card";
// 定义参数接口
interface AddCardParams {
  name: string; // 假设name是必传的字符串类型
  data?: { [key: string]: any }; // 自定义数据，默认为空对象
  id?: number; // id，默认为当前时间戳
  deskId?: string; // deskId，可选的字符串类型
}
/**
 *
 * @description 添加桌面卡片api
 *
 * @param name 卡片名称  必填
 * @param data 卡片数据
 * @param id 指定ID 不传则自动生成
 * @param deskId 指定桌面ID
 * @return id
 */
export const useAddCardV2 = (
  option: AddCardParams = {
    name: "",
    data: {},
    id: Date.now(),
    deskId: "",
  }
): number | string => {
  // 解构数据
  const { name, data, id, deskId }: any = option;

  if (!name) {
    console.error("name is required");
    return 0;
  }

  // 如果有桌面id，添加到指定桌面
  if (deskId) {
    // 获取所有桌面
    const cardStore: any = useCardStore();
    const { desks } = storeToRefs(cardStore);
    // 查找指定桌面
    let res = desks.value.find((item) => {
      if (item.id == deskId) return item;
    });
    // 添加卡片
    res.cards.push({
      id,
      name,
      customData: data,
    });
  } else {
    // 获取当前桌面
    const freeLayoutStore = useFreeLayoutStore();
    const { getCurrentDesk }: any = storeToRefs(freeLayoutStore);
    // 添加卡片
    getCurrentDesk.value.cards.push({
      id,
      name,
      customData: data,
    });
  }

  return id;
};
