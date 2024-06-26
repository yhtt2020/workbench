// 外部通过群聊id进行跳转的方法
import { TUIConversationService } from "@tencentcloud/chat-uikit-engine";

export const useGroupJump = (groupId:any) =>{
  const name = `GROUP${groupId}`;
  (window as any).$ui.router.push({name:'chatMain'});
  (window as any).$TUIKit?.TUIConversation?.switchConversation(name);
}
