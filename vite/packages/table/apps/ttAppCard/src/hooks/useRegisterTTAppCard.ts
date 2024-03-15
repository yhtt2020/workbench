/**
 * 注册文件夹
 */
import { cardStore } from "../../../../store/card";
import { nanoid } from "nanoid";
import _ from "lodash-es";
export const useRegisterTTAppCard = (desk, list) => {
  desk.cards.push({
    name: "TTAppCard",
    id: Date.now(),
    customData: {},
  });
};
