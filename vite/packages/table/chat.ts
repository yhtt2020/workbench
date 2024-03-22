import {TUIComponents,TUICore,genTestUserSig} from './TUIKit'
import {TUICallKit} from '@tencentcloud/call-uikit-vue'
import {SDKAppID} from "./js/chat/chat";
import {TUIComponents, TUICore} from "./TUIKit";
import {SDKAppID} from "./js/chat/chat";
import {TUICallKit} from "@tencentcloud/call-uikit-vue";
import {TUINotification} from "./TUIKit/TUIPlugin";
const TUIKit = TUICore.init({
  SDKAppID,
});
function loadChat(){
  try{
    TUIKit.tim.setLogLevel(0);//关闭日志，如果需要调试，改为4
// TUIKit add TUIComponents
    TUIKit.use(TUIComponents);
// TUIKit add TUICallKit
    //TUIKit.use(TUICallKit);


    window.$TUIKit=TUIKit
    window.$chat=TUIKit.tim

    TUINotification.getInstance().setNotificationConfiguration({
      // 是否显示预览信息
      showPreviews: true,
      // 是否允许通知
      allowNotifications: true,
      // 通知标题
      notificationTitle: "天天工作台",


      notificationIcon: "/icons/IM.png",
    });



    window.$chat.on(window.$TUIKit.TIM.EVENT.MESSAGE_RECEIVED,(event) =>{  // 全局监听团队聊天消息
      // console.log('检测重复问题',event);
      window.$notice.receiveNotification(event)
    })
  }catch (e) {
    console.log(e)
    console.error('聊天载入失败')
  }

}



export   {
  loadChat,
  TUIKit
}
