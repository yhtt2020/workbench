import { useTTAppStore } from "../store";
import { storeToRefs } from "pinia";
export const getCardData = () => {
  // 数据获取
  const ttappStore = useTTAppStore();
  const { ttappList } = storeToRefs(ttappStore);
  // 判断是否有数据
  if (ttappList.value.length == 0) return;
  // 数据转换
  // return true;
  let data: any = {
    cname: "应用组件",
    children: [],
  };
  ttappList.value.forEach((item: any) => {
    data.children.push({
      type: "ttapp",
      cname: item.name,
      detail: item.description,
      sizes: [item.card.size],
      time: "2024/6/28",
      img: item.card._preview,
      // zoom: "14",
      // option: item.option,
      option: [
        {
          customData: {
            id: item.id,
          },
        },
      ],
    });
  });

  console.log("data :>> ", data);
  return data;
};
