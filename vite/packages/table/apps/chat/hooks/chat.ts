// 将社群的退出方法
import { chatCommunityStore } from "../store/chatCommunity";
import { storeToRefs } from "pinia";
import _ from "lodash-es";

export const chatLogout = () => {
  (window as any).$TUIKit.logout();
  (window as any).$TUIKit.TUIStore.storeMap.conversation.store.conversationList = [];
  (window as any).$TUIKit.TUIStore.storeMap.group.store.conversationList = [];
  (window as any).$TUIKit.TUIStore.storeMap.friend.store.conversationList = [];
  const chatCommunity: any = chatCommunityStore();
  const { myCommunity, currentCommunityNo } = storeToRefs(chatCommunity);
  const filterMy = _.filter(myCommunity.value, (item: any) => {
    return Number(item.id) === 0;
  });
  myCommunity.value = filterMy;
  currentCommunityNo.value = null;
};

// export class ChatLogout {
//   async logout() {

//   }
// }
