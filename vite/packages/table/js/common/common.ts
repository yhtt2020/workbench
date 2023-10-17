import { notification } from "ant-design-vue";
import {appStore} from "../../store";

export async function toggleFullScreen() {
  tsbApi.window.setFullScreen(true)
  appStore().showWindowController = false
  notification.info({
    message: '功能提示',
    description:
      '进入全屏模式，会自动隐藏窗口控制按钮，可在设置中重新开启。',
    onClick: () => {
      console.log('Notification Clicked!');
    },
  });

  // this.fullScreen()   //触发全屏的按钮
}

