import { useToast } from "vue-toastification";
import { appStore } from "../../store";
import { chatStore } from "../../store/chat";
import { noticeStore } from "../../page/notice/store/noticeStore";
import { storeToRefs } from "pinia";
import { router } from "../../router";
import _ from "lodash-es";
import { TUIConversationService } from "@tencentcloud/chat-uikit-engine";

import ClockNoticeToast from "../../page/notice/toast/ClockNoticeToast.vue";
import SystemNoticeToast from "../../page/notice/toast/SystemNoticeToast.vue";
import MessageNoticeToast from "../../page/notice/toast/MessageNoticeToast.vue";
import NoticeToast from "../../page/notice/toast/NoticeToast.vue";

const toast = useToast();

export class Notifications {
  noticeModal = null;
  public showNoticeModal(message) {
    this.noticeModal.showModal(message);
  }
  public NoticeToast() {
    toast.info(
      {
        component: NoticeToast,
        props: { noticeType: "notice" },
        listeners: {
          nowCheck: function () {
            (appStore() as any).hideNoticeEntry();
          },
        },
      },
      {
        icon: false,
        closeOnClick: false,
        closeButton: false,
        pauseOnFocusLoss: true,
        pauseOnHover: true,
        timeout: 0,
        toastClassName: "notice-toast",
      }
    );
  }

  // 闹钟的通知
  public clockToast(msg: any, title: any, changeIcon: any) {
    toast.info(
      {
        component: ClockNoticeToast,
        props: {
          content: msg,
          noticeType: "notice",
          isPlay: (appStore() as any).$state.settings.noticePlay,
          title: title,
          changeIcon: changeIcon,
        },
        listeners: {
          nowCheck: function () {
            (appStore() as any).hideNoticeEntry();
          },
        },
      },
      {
        icon: false,
        closeOnClick: false,
        closeButton: false,
        pauseOnFocusLoss: true,
        pauseOnHover: true,
        timeout: 0,
        toastClassName: "notice-toast",
      }
    );
  }

  public notice(msg) {
    if (msg.noticeType === 1) {
      this.noticeWeak(msg);
    } else if (msg.noticeType === 2) {
      this.noticeStrong(msg);
    }
  }

  public noticeStrong(notice) {
    const msg = this._convertNoticeMsg(notice);
    (noticeStore() as any).putMessageData(msg, "strong");
    if (this.noticeModal) {
      console.log("显示消息弹窗");
      this.showNoticeModal(msg);
    }
  }

  public _convertNoticeMsg(notice) {
    const msg = {
      id: notice.id,
      type: "push",
      title: notice.title || "推送消息",
      icon: "/icons/newspaper.svg",
      covers: notice.covers,
      body: notice.summary,
      content: notice.content,
      time: Date.now(),
      urls: notice.urls,
    };
    return msg;
  }

  public noticeWeak(notice: Object) {
    const { settings } = storeToRefs(appStore() as any);
    const msg = this._convertNoticeMsg(notice);
    console.error("通知的消息体", msg);
    let content = {
      component: MessageNoticeToast,
      props: {
        msg,
        type: "push",
        play: settings.value.enablePlay,
      },
      listeners: {
        closeToast: () => {
          console.log("关闭消息", "notice_" + notice.id);
          toast.dismiss("notice_" + notice.id);
        },
        pause: () => {
          console.log("停止lo");
          toast.update("notice_" + notice.id, {
            content: content,
            options: {
              timeout: false,
            },
          });
        },
      },
    };
    (noticeStore() as any).putMessageData(msg, "weak");
    toast.info(content, {
      id: "notice_" + notice.id,
      icon: false,
      closeOnClick: false,
      closeButton: false,
      pauseOnFocusLoss: true,
      pauseOnHover: true,
      timeout: 20000,
      toastClassName: "notice-toast",
      onClose() {},
    });
  }

  // 消息弱提醒
  public messageWeak(msg: any, conversationID: any) {
    const { settings } = storeToRefs(appStore() as any);
    (noticeStore() as any).putMessageData(msg);
    toast.info(
      {
        component: MessageNoticeToast,
        props: { msg, type: "message", play: settings.value.messagePlay },
        listeners: {
          putNotice: function () {
            // console.log("关闭并存储数据", msg);
          },
          messageExamine: function () {
            (chatStore() as any).updateConversation(conversationID);
            (appStore() as any).hideNoticeEntry();
            router.push({ name: "chatMain" });
            TUIConversationService.switchConversation(conversationID);
          },
        },
      },
      {
        icon: false,
        closeOnClick: false,
        closeButton: false,
        pauseOnFocusLoss: true,
        pauseOnHover: true,
        timeout: 5000,
        toastClassName: "notice-toast",
        onClose() {},
      }
    );
  }

  // 消息强提醒
  public messageStrong(msg: any, conversationID: any) {
    const { settings } = storeToRefs(appStore() as any);
    (noticeStore() as any).putMessageData(msg);
    toast.info(
      {
        component: SystemNoticeToast,
        props: { msg, type: "notice", play: settings.value.noticePlay },
        listeners: {
          putNotice: function () {
            // console.log("关闭并存储数据", msg);
          },
          systemExamine: function () {
            (chatStore() as any).updateConversation(conversationID);
            router.push({ name: "chatMain" });
            TUIConversationService.switchConversation(conversationID);
          },
        },
      },
      {
        icon: false,
        closeOnClick: false,
        closeButton: false,
        pauseOnFocusLoss: true,
        pauseOnHover: true,
        timeout: 0,
        toastClassName: "notice-toast",
      }
    );
  }

  // 创建音频播放组件
  private createSoundElement(): HTMLAudioElement {
    let audioElement = document.getElementById(
      "messageAudio"
    ) as HTMLAudioElement;
    if (!audioElement) {
      audioElement = document.createElement("audio");
      audioElement.src = "/sound/message.mp3";
      audioElement.setAttribute("id", "messageAudio");
      document.body.appendChild(audioElement);
    }
    return audioElement;
  }

  // 创建音频强提醒
  private createSoundStrongElement(): HTMLAudioElement {
    let audioElement = document.getElementById(
      "messageAudio"
    ) as HTMLAudioElement;
    if (!audioElement) {
      audioElement = document.createElement("audio");
      audioElement.src = "/sound/notice.mp3";
      audioElement.setAttribute("id", "messageAudio");
      document.body.appendChild(audioElement);
    }
    return audioElement;
  }

  // 获取字符串中的数字
  private extractNumbersFromString(str: any) {
    const regex = /\d+/g; // 匹配一个或多个数字的正则表达式
    const matches = str.match(regex); // 使用match方法获取匹配的数字数组
    if (matches) {
      return matches.map(Number); // 将字符串数字转换为数字类型
    } else {
      return []; // 如果没有匹配到数字则返回空数组
    }
  }

  // 社群消息通知
  public async receiveNotification(msg: any) {
    const { settings, userInfo } = storeToRefs(appStore() as any);
    const data = { ...msg.data[0] };

    // 获取群聊消息基础内容
    const rs = await (
      window as any
    ).$TUIKit?.TUIConversation?.getConversationProfile(data.conversationID);

    const muteVisible = rs.data?.conversation?.messageRemindType;

    // 获取当前会话id
    const currentConversationID = rs.data?.conversation?.conversationID;

    // 消息通知满足条件
    const config = {
      // 消息通知开关
      enable: settings.value.noticeEnable === false,
      // 是否在聊天页面
      global: router.currentRoute.value.fullPath === "/chatMain",
      // 提示音开关
      soundSwitch: settings.value.enablePlay,
      // @全部消息
      atMsg: data.atUserList.length !== 0,
      // @我的消息
      atMeMsg: data.atUserList.includes(String(userInfo.value.uid)),
      // 消息免打扰
      msgMute: muteVisible === "AcceptAndNotify",
      // 当前会话
      currentConversation: currentConversationID !== data.conversationID,
    };

    // 消息内容为text是否存在
    const isText = data.payload.hasOwnProperty("text");

    // 当前消息开关是否开启
    if (config.enable) {
      // 区分当前路由是否在群聊页面中
      if (config.global) {
        // 非当前会话
        if (!config.currentConversation) {
          if (config.atMeMsg || config.atMsg) {
            const strongEl: HTMLAudioElement = this.createSoundStrongElement();
            strongEl.play();
          }
          // 非@消息
          else {
            const playElement: HTMLAudioElement = this.createSoundElement();
            playElement.play();
          }
        }
      }
      // 全局情况下
      else {
        // 纯文字情况下
        if (isText) {
          const rs = await handleMsgContent(data);
          // @我的  @所有人
          if (config.atMeMsg || config.atMsg) {
            // 提示音开关是否开启
            if (config.soundSwitch) {
              if (config.msgMute) {
                this.messageStrong(rs, data.conversationID);
              }
            }
          }
          // 其他场景
          else {
            // 提示音开关是否开启
            if (config.soundSwitch) {
              if (config.msgMute) {
                this.messageWeak(rs, data.conversationID);
              }
            }
          }
        }
        // 其他消息内容,其中包含(文件、图片、等等)
        else {
          const fileRs = await handlerMesFileContent(data);
          if (config.soundSwitch) {
            if (config.msgMute) {
              this.messageWeak(fileRs, data.conversationID);
            }
          }
        }
      }
    }

  }
}

// 处理群聊消息纯文本
async function handleMsgContent(data: any) {
  // 区分是好友还是群聊常量
  const handleType = data.conversationType;
  // 好友
  if (handleType === "C2C") {
    const friendContent = {
      icon: data.avatar,
      title: `好友${data.nick}的消息`,
      conversationID: data.conversationID,
      body: getTextMsgContent(data),
      time: data.time,
      type: "message",
    };
    return friendContent;
  }
  // 群聊
  else if (handleType === "GROUP") {
    // 获取群聊列表
    const groupRs = await (window as any).$TUIKit?.chat?.getGroupList();
    const groupList = groupRs?.data?.groupList;
    const found = _.find(groupList, (item: any) => {
      return String(item.groupID) === String(data.to);
    });
    // 需要的参数
    const textContent = {
      icon: found?.avatar,
      title: found?.name,
      body: getTextMsgContent(data),
      conversationID: data.conversationID,
      time: data.time,
      type: "message",
    };
    return textContent;
  }
}
// 获取纯文本消息内容,返回字符串
function getTextMsgContent(data: any) {
  return `${data.nick}：${data.payload.text}`;
}

// 解析群聊文件消息
async function handlerMesFileContent(data: any) {
  // 区分是好友还是群聊常量
  const handleType = data.conversationType;
  // 好友
  if (handleType === "C2C") {
     const friendContent = {
       icon: data.avatar,
       title: `好友${data.nick}的消息`,
       conversationID: data.conversationID,
       body: getMsgFileData(data),
       time: data.time,
       type: "message",
     };
     return friendContent;
  }
  // 群聊
  else if (handleType === "GROUP") {
    // 获取群聊列表
    const groupRs = await (window as any).$TUIKit?.chat?.getGroupList();
    const groupList = groupRs?.data?.groupList;
    const found = _.find(groupList, (item: any) => {
      return String(item.groupID) === String(data.to);
    });
    // 需要的参数
     const textContent = {
       icon: found?.avatar,
       title: found?.name,
       body: getMsgFileData(data),
       conversationID: data.conversationID,
       time: data.time,
       type: "message",
     };
     return textContent;
  }
}
// 获取文件发送提示信息的描述
function getMsgFileData(data: any) {
  // 文件的
  if (data?.payload?.hasOwnProperty("downloadFlag")) {
    if (data?.payload?.fileName) {
      return `${data?.nick}发送了一个文件: ${data?.payload?.fileName}`;
    } else {
      return `${data?.nick}发送了一个文件`;
    }
  }
  // 图片的
  else if (data?.payload?.hasOwnProperty("imageFormat")){
    return `${data?.nick}发送了一张图片文件`;
  }
  // 视频的
  else if(data?.payload?.hasOwnProperty("videoFormat")){
    return `${data?.nick}发送了一视频文件`
  }

}
