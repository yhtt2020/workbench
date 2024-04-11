import { useTTAppStore } from "../store";
import { storeToRefs } from "pinia";
export const getCardData = () => {
  // 数据获取
  const ttappStore = useTTAppStore();
  const { ttappList } = storeToRefs(ttappStore);
  // 判断是否有数据
  if (ttappList.value.length == 0) return;
  // 数据转换
  let data: any = {
    cname: "应用组件",
    children: [],
  };
  ttappList.value.forEach((item: any) => {
    if(!item.card) return
    data.children.push({
      type: "ttapp",
      cname: item.name,
      detail: item.description,
      sizes: [item.card.size],
      time: "2024/6/28",
      img: item.card._preview,
      data: { id: item.id },
      // 伪数据 只是防止报错
      option: [{}],
    });
  });

  console.log("data :>> ", data);
  return data;
};
