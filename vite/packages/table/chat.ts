import { TUIComponents, genTestUserSig, TUIChatKit,} from "./apps/TUIKit";
import TUIChatEngine from "@tencentcloud/chat-uikit-engine";
import TUINotification from "./apps/TUIKit/components/TUINotification/index";
import { TUICallKit } from "@tencentcloud/call-uikit-vue";
import { TUILogin, TUIConstants } from "@tencentcloud/tui-core";


// import { SDKAppID } from "./js/chat/chat";
// import { TUICallKit } from "@tencentcloud/call-uikit-vue";
// import { SDKAppID } from "./js/chat/chat";
// import { TUIComponents, TUICore } from "./TUIKit";
// // import {TUINotification} from "./TUIKit/TUIPlugin";
// const TUIKit = TUICore.init({
//   SDKAppID,
// });

const TUIKit:any = {
  TUIComponents,
  TUIChatKit,
};

function loadChat() {
  try {
    // IM组件初始化
    TUIChatKit.init();
    /**如果后期IM需要升级的话,此处只需要修改当前window.$TUIKit和window.$chat即可**/ 
    // 将TUIChatEngine挂载在window.$TUIKit,
    (window as any).$TUIKit = TUIChatEngine;
    // 将TUIChatEngine中的chat挂载在window.$chat
    (window as any).$chat = TUILogin;
    //关闭日志，如果需要调试，改为4
    TUIChatEngine.setLogLevel(0);
    //关闭系统弹窗提示
    TUINotification.setNotificationConfiguration({
      // 是否显示预览信息
      showPreviews: true,
      // 是否允许通知
      allowNotifications: false,
      // 通知标题
      notificationTitle: "天天工作台",


      notificationIcon: "/icons/IM.png",
    });


    //   notificationIcon: "/icons/IM.png",
    // });
  } catch (e) {
    console.error("聊天载入失败", e);
  }
}

export {
  loadChat,
  TUIKit
};
