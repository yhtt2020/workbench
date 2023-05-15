import {isMain} from "./screenUtils";

const mainIPC = {
  /**
   * 发送IPC给全部的子屏幕，本质上通过主线程IPC转发
   */
  sendToSubs(channel, args={}) {
    ipc.send('sendToSubs', {channel, args})
  },
  sendToSub(key, channel, args) {
    ipc.send('sendToSub', {key, channel, args})
  },
  on(channel, cb) {
    ipc.on(channel, cb)
  }
}

const subIPC = {
  on(channel, cb) {
    ipc.on(channel, cb)
  }
}

export {mainIPC, subIPC}
