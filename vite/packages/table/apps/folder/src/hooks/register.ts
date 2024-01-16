/**
 * 注册文件夹
 */
import { cardStore } from "../../../../store/card";
import { defaultFolderData } from "../components/options";
import { completeTask } from "../../../task/task";
import { nanoid } from "nanoid";
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
  completeTask("M0103");
};
