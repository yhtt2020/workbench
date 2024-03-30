import TUIChatEngine from "@tencentcloud/chat-uikit-engine";

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
export const joinName = (type:any) =>{
  switch (type) {
   case TUIChatEngine.TYPES.JOIN_OPTIONS_FREE_ACCESS:
    return '自由加入';
   case TUIChatEngine.TYPES.JOIN_OPTIONS_NEED_PERMISSION:
    return '需要验证';
   case TUIChatEngine.TYPES.JOIN_OPTIONS_DISABLE_APPLY:
    return '禁止加群';
  }
}
// 邀请方式名称
export const inviteName = (type:any) =>{
 switch (type) {
  case TUIChatEngine.TYPES.JOIN_OPTIONS_FREE_ACCESS:
   return '自由邀请';
  case TUIChatEngine.TYPES.JOIN_OPTIONS_NEED_PERMISSION:
   return '需要验证';
  case TUIChatEngine.TYPES.JOIN_OPTIONS_DISABLE_APPLY:
   return '禁止邀请';
 }
}