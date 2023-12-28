/**
 * 注册文件夹
 */
import { cardStore } from "../../../../store/card";

export const registerFolder = (desk) => {
  const card: any = cardStore();
  card.addCard(
    {
      name: "folder",
      id: Date.now(),
      customData: {
        name: "文件夹",
        icon: "",
        list: [],
        cardSize: {
          name: "small",
          width: 1,
          height: 1,
        },
        // 文件锁 开启后无法拖出
        lock: true,
        // 布局样式
        layout: "rows", // columns
        // 排序规则
        sort: "free",
        // 文件夹模式
        model: "custom",
        // 分类规则
        rules: [],
      },
    },
    desk
  );
};
