/**
 * 注册文件夹
 */
import { cardStore } from "../../../../store/card";
import { defaultFolderData } from "../components/options";
import { completeTask } from "../../../task/task";
import { nanoid } from "nanoid";
import _ from "lodash-es";
export const registerFolder = (desk, list) => {
  // const card: any = cardStore();
  // card.addCard(
  //   {
  //     name: "folder",
  //     id: Date.now(),
  //     customData: defaultFolderData,
  //   },
  //   desk
  // );
  list = list?list:[]
  let data = _.cloneDeep(defaultFolderData);
  desk.cards.push({
    name: "folder",
    id: Date.now(),
    customData: {
      ...data,
      list: list
    },
  });
  completeTask("M0103");
};
