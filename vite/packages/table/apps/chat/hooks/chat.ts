// 将社群的退出方法
import { chatCommunityStore } from "../store/chatCommunity";
import { storeToRefs } from "pinia";
import _ from "lodash-es";
import { useNavigationStore } from "../../../components/desk/navigationBar/navigationStore";
import { appStore } from "../../../store";

/**群聊退出登录操作**/
export const chatLogout = () => {
  (window as any).$chat?.chat?.logout();
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
  (useNavigationStore() as any).communityNavVisible = false;
  (appStore() as any).settings.isCommunity = true;
};

/**登录刷新**/
export const updateLogin = async() =>{
  const chatCommunity: any = chatCommunityStore();
  chatCommunity.getMyCommunity();
}
