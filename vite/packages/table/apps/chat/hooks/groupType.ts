import TUIChatEngine from "@tencentcloud/chat-uikit-engine";
import _ from "lodash-es";

// 群类型名称
export const getTypeName = (type: any) => {
  switch (type) {
    case TUIChatEngine.TYPES.GRP_PUBLIC:
      return "陌生人社交群";
    case TUIChatEngine.TYPES.GRP_MEETING:
      return "临时会议群";
    case TUIChatEngine.TYPES.GRP_WORK:
      return "好友工作群";
    // case TUIChatEngine.TYPES.GRP_AVCHATROOM:
    //   return '直播群';
    // case TUIChatEngine.TYPES.GRP_COMMUNITY:
    //   return '社群';
  }
};
// 入群方式名称
export const joinName = (type: any) => {
  switch (type) {
    case TUIChatEngine.TYPES.JOIN_OPTIONS_FREE_ACCESS:
      return "自由加入";
    case TUIChatEngine.TYPES.JOIN_OPTIONS_NEED_PERMISSION:
      return "需要验证";
    case TUIChatEngine.TYPES.JOIN_OPTIONS_DISABLE_APPLY:
      return "禁止加群";
  }
};
// 邀请方式名称
export const inviteName = (type: any) => {
  switch (type) {
    case TUIChatEngine.TYPES.INVITE_OPTIONS_FREE_ACCESS:
      return "自由邀请";
    case TUIChatEngine.TYPES.INVITE_OPTIONS_NEED_PERMISSION:
      return "需要验证";
    case TUIChatEngine.TYPES.INVITE_OPTIONS_DISABLE_INVITE:
      return "禁止邀请";
  }
};

// 根据当前用户的角色，进行排序, 群主在前，管理员在后，普通成员在最后
export const sortMembers = (members: any) => {
  // 根据当前用户的角色，进行排序, 群主在前，管理员在后，普通成员在最后
  const sortList = members.sort((a: any, b: any) => {
    if (a.role === "Owner") {
      return -1;
    } else if (a.role === "Admin" && b.role === "Member") {
      return -1;
    } else if (a.role === "Member") {
      return 1;
    }
    return 0;
  });
  // 过滤掉不需要的字段
  const newList = sortList.map((item: any) => {
    return {
      role: item.role,
      avatar: item.avatar,
      nick: item.nick,
      userID: item.userID,
    };
  });
  return newList;
};

// 获取当前群聊创建的类型
export const currentGroupType = [
  {
    icon: "https://web.sdk.qcloud.com/im/assets/images/Public.svg",
    label: "陌生人社交群（Public）",
    name: "陌生人社交群",
    value: TUIChatEngine.TYPES.GRP_PUBLIC,
    detail:
      "类似 QQ 群，创建后群主可以指定群管理员，用户搜索群 ID 发起加群申请后，需要群主或管理员审批通过才能入群。",
    src: "产品文档",
  },
  {
    icon: "https://web.sdk.qcloud.com/im/assets/images/Meeting.svg",
    label: "临时会议群（Meeting）",
    name: "临时会议群",
    value: TUIChatEngine.TYPES.GRP_MEETING,
    detail:
      "创建后可以随意进出，且支持查看入群前消息；适合用于音视频会议场景、在线教育场景等与实时音视频产品结合的场景。",
    src: "产品文档",
  },
  {
    icon: "https://web.sdk.qcloud.com/im/assets/images/Work.svg",
    label: "好友工作群（Work）",
    name: "好友工作群",
    value: TUIChatEngine.TYPES.GRP_WORK,
    detail:
      "类似普通微信群，创建后仅支持已在群内的好友邀请加群，且无需被邀请方同意或群主审批。",
    src: "产品文档",
  },
];

/**当前群聊的未读数据**/
export const currentUnreadCount = (no: any) => {
  const list = (window as any).$TUIKit?.TUIStore?.storeMap?.conversation?.store
    ?.conversationList;
  if (!list) {
    return 0;
  } else {
    const unreadCount = list.find(
      (item: any) => String(item.groupProfile.group) === String(no)
    );
    if(unreadCount){
      return unreadCount?.unreadCount;
    }
    else {
      return 0;
    }
  }
};
