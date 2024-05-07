// 将社群的退出方法
import { chatCommunityStore } from "../store/chatCommunity";
import { storeToRefs } from "pinia";
import _ from "lodash-es";

/**群聊退出登录操作**/ 
export const chatLogout = () => {
  (window as any).$TUIKit.logout();
  (window as any).$TUIKit.TUIStore.storeMap.conversation.store.conversationList = [];
  (window as any).$TUIKit.TUIStore.storeMap.group.store.groupList = [];
  (window as any).$TUIKit.TUIStore.storeMap.friend.store.friendList = [];
  const chatCommunity: any = chatCommunityStore();
  const { myCommunity, currentCommunityNo } = storeToRefs(chatCommunity);
  const filterMy = _.filter(myCommunity.value, (item: any) => {
    return Number(item.id) === 0;
  });
  myCommunity.value = filterMy;
  currentCommunityNo.value = null;
};

/**登录刷新**/
export const updateLogin = async() =>{
  const chatCommunity: any = chatCommunityStore();
  await (window as any).$chat?.chat?.getGroupList();
  await (window as any).$chat?.chat?.getFriendList();
  await (window as any).$chat?.chat?.getConversationList();
  chatCommunity.getMyCommunity();
}
