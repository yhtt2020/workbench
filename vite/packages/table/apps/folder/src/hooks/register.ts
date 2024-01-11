/**
 * 注册文件夹
 */
import { cardStore } from "../../../../store/card";
import { defaultFolderData } from "../components/options";
import _ from "lodash-es";
export const registerFolder = (desk) => {
  // const card: any = cardStore();
  // card.addCard(
  //   {
  //     name: "folder",
  //     id: Date.now(),
  //     customData: defaultFolderData,
  //   },
  //   desk
  // );
  let data = _.cloneDeep(defaultFolderData);
  desk.cards.push({
    name: "folder",
    id: Date.now(),
    customData: data,
  });
};
