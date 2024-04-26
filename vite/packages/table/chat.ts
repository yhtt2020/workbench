import { TUIComponents, genTestUserSig, TUIChatKit,} from "./apps/TUIKit";
import TUIChatEngine from "@tencentcloud/chat-uikit-engine";
import TUINotification from "./apps/TUIKit/components/TUINotification/index";
import { TUICallKit } from "@tencentcloud/call-uikit-vue";
import TUICore, { TUILogin, TUIConstants } from "@tencentcloud/tui-core";
import TencentCloudChat from '@tencentcloud/chat';
import TIMUploadPlugin from 'tim-upload-plugin';

/**引入sdkID**/ 
import { SDKAppID } from "./js/chat/chat";

/**接入时需要将0替换为您的即时通信 IM 应用的 SDKAppID**/ 
let options = {
  SDKAppID: SDKAppID
};

/**
 * 创建 SDK 实例，`TIM.create()`方法对于同一个 `SDKAppID` 只会返回同一份实例
 * SDK 实例通常用 chat 表示
 */
let chat = TencentCloudChat.create(options); 

const TUIKit:any = {
  TUIComponents,
  TUIChatKit,
};

function loadChat() {
  try {

    /**IM组件初始化**/ 
    TUIChatKit.init();

    /**
     * 如果后期IM需要升级的话,此处只需要修改当前window.$TUIKit和window.$chat即可。
     * 将chat中的方法挂载在window.$TUIKit,
     * **/ 
    (window as any).$TUIKit = TUIChatEngine;

    /**将TUIChatEngine中的chat挂载在window.$chat  这里继承原先的sdk**/ 
    (window as any).$chat = chat;

    /**
     * 关闭日志，如果需要调试，改为4。
     * release 级别，SDK 输出关键信息，生产环境时建议使用
     * chat.setLogLevel(1);
     * **/
    chat.setLogLevel(0);

    /**关闭系统弹窗提示**/ 
    TUINotification.setNotificationConfiguration({
      // 是否显示预览信息
      showPreviews: true,
      // 是否允许通知
      allowNotifications: false,
      // 通知标题
      notificationTitle: "天天工作台",


      notificationIcon: "/icons/IM.png",
    });

    /**注册腾讯云即时通信 IM 上传插件**/
    chat.registerPlugin({'tim-upload-plugin': TIMUploadPlugin});

  } catch (e) {
    console.error("聊天载入失败", e);
  }
}

export {
  loadChat,
  TUIKit
};
