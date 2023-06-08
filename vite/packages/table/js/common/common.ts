import {Modal as antModal} from "ant-design-vue/lib/components";
import {appStore} from "../../store";

export async function toggleFullScreen() {
  tsbApi.window.setFullScreen(true)
  appStore().showWindowController = false
  antModal.info({
    content: '进入全屏模式，会自动隐藏窗口控制按钮，可在设置中重新开启。',
    centered: true,
    onOk: () => {
    }
  })
  // this.fullScreen()   //触发全屏的按钮
}

