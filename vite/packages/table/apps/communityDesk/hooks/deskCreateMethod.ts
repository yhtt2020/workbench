import { cardStore } from "../../../store/card";
import { storeToRefs } from "pinia";
import _ from "lodash-es";

// 导航个人桌面切换到社群桌面方法
export const getCommunityDeskList = (communityInfo: any) => {
  const { desks } = storeToRefs(cardStore() as any);
  const currentCommunityDesks = _.filter(desks.value, (desk: any) => {
    return Number(desk?.communityNo) === Number(communityInfo?.no);
  });
  return currentCommunityDesks;
};