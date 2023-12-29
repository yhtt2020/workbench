/**
 * 注册文件夹
 */
import { cardStore } from "../../../../store/card";
import { defaultFolderData } from "../components/options";
export const registerFolder = (desk) => {
  const card: any = cardStore();
  card.addCard(
    {
      name: "folder",
      id: Date.now(),
      customData: defaultFolderData,
    },
    desk
  );
};
