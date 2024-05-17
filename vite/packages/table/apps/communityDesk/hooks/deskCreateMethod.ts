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

// 解析时间戳的转换方法
export const generateSearchResultTime = (timestamp: number) => {
  console.log("时间转换", timestamp);

  const now = new Date().getTime();
  // 时间差
  const diff = now - timestamp;

  const minute = 60 * 1000;
  const hour = 60 * minute;

  if (diff < minute) {
    return "刚刚";
  } else if (diff < hour) {
    const minutesAgo = Math.floor(diff / minute);
    return `${minutesAgo}分钟前`;
  } else if (diff < 24 * hour) {
    const hoursAgo = Math.floor(diff / hour);
    return `${hoursAgo}小时前`;
  } else {
    const target = new Date(timestamp);

    function formatNum(num: number): string {
      return num < 10 ? "0" + num : num.toString();
    }

    const todayZero = new Date().setHours(0, 0, 0, 0);
    const thisYear = new Date(
      new Date().getFullYear(),
      0,
      1,
      0,
      0,
      0,
      0
    ).getTime();

    if (timestamp >= todayZero) {
      return `${formatNum(target.getHours())}:${formatNum(
        target.getMinutes()
      )}`;
    } else if (timestamp >= thisYear) {
      return `${target.getMonth() + 1}/${target.getDate()} ${formatNum(
        target.getHours()
      )}:${formatNum(target.getMinutes())}`;
    } else {
      return `${target.getFullYear()}/${
        target.getMonth() + 1
      }/${target.getDate()} ${formatNum(target.getHours())}:${formatNum(
        target.getMinutes()
      )}`;
    }
  }
};
