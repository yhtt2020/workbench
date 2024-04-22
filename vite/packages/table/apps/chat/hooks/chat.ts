// 将社群的退出方法
import { chatCommunityStore } from "../store/chatCommunity";
import { storeToRefs } from "pinia";
import _ from "lodash-es";

export class ChatLogout {
  logout() {
    // 清除群聊登录
    (window as any).$chat?.chat?.logout();
    const chatCommunity: any = chatCommunityStore();
    const { myCommunity } = storeToRefs(chatCommunity);
    const filterMy = _.filter(myCommunity.value,(item:any)=>{
     return Number(item.id) === 0;
    });
    myCommunity.value = filterMy;
  }
}
