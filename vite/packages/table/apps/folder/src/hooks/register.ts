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
        lock: true,
        title: "文件夹",
        icon: "",
        list: {},
        layout: "rows", // columns
        sort: "useCount",
        bg: "#508BFE",
        switch: false,
        name: "icon",
        model: "custom",
        rules: [],
      },
    },
    desk
  );
};
