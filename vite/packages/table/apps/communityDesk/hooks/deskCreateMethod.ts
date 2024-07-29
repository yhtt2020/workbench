import { cardStore } from "../../../store/card";
import { storeToRefs } from "pinia";
import _ from "lodash-es";
import { communityNavStore } from "../../../components/bottomPanel/store/communityNavStore";

// 导航个人桌面切换到社群桌面方法
export const getCommunityDeskList = (communityInfo: any) => {
  const card: any = cardStore();
  const { desks } = storeToRefs(card);
  // 过滤出所有社群桌面的数据
  const allCommunityDesk = _.filter(desks.value, (desk: any) => {
    return desk.hasOwnProperty("communityNo");
  });
  // 过滤出指定社群的桌面数据
  const specifyCommunityDesks = _.filter(allCommunityDesk, (desk: any) => {
    return Number(desk?.communityNo) === Number(communityInfo?.no);
  });
  return specifyCommunityDesks;
};

// 解析时间戳的转换方法
export const generateSearchResultTime = (timestamp: number) => {
  // console.log("时间转换", timestamp);

  if(!timestamp){
    return '从未'
  }
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

// 根据当前社群号来获取当前社群的管理员
export const communityAuth = (no:any) => {
  const { currentCommunity } = storeToRefs(communityNavStore() as any);
  const communityNo = currentCommunity.value?.item?.no;
  if(Number(no) === Number(communityNo)){
    return currentCommunity.value?.item?.role  === 'owner';
  }
};


// 判断数组是否有更新变化
export const isArrayEqual = (oldList:any,newList:any) =>{
  if (oldList.length !== newList.length) {
    return false;
  }
  for (let i = 0; i < oldList.length; i++) {
    if (oldList[i] !== newList[i]) {
      return false;
    }
  }
  return true;
}


// 根据当前社群号来获取当前社群的成员
export const communityMember = (no:any) => {
  const { currentCommunity } = storeToRefs(communityNavStore() as any);
  const communityNo = currentCommunity.value?.item?.no;
  if(Number(no) === Number(communityNo)){
    return currentCommunity.value?.item?.role  === 'member';
  }
};

// 处理icon图标颜色渲染
export const communityIconType = (url:any)=>{
  if(url?.includes("color=#")) return 'select';
}
