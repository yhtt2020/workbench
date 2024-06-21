import { useToast } from "vue-toastification";
import { appStore } from "../../store";
import { chatStore } from "../../store/chat";
import { noticeStore } from "../../page/notice/store/noticeStore";
import { storeToRefs } from "pinia";
import { router } from "../../router";
import _ from "lodash-es";
import { TUIConversationService } from "@tencentcloud/chat-uikit-engine";
import {
  handleMsgContent,
  handlerMesFileContent,
  handlerSystemMsg,
  createSoundStrongElement,
  createSoundElement,
} from "./hook/noticeHook";

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
    // (noticeStore() as any).putMessageData(msg);
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
            (window as any).$TUIKit?.TUIConversation?.switchConversation(conversationID);
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
    // (noticeStore() as any).putMessageData(msg);
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
            (window as any).$TUIKit?.TUIConversation?.switchConversation(conversationID);
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

    console.log('测试',msg);
    console.log('测试',Date.now());


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
      /**
       * 纯文本消息
       * 好友、群聊
       * config.global 为true是局部,false是全局
       * config.currentConversation 为true是当前所在会话,false是非当前所在会话中
       * config.atMeMsg config.atMsg 为true是@的消息, false则相反
       * **/
      if (isText) {
        if (config.global) {
          if (!config.currentConversation) {
            if (config.atMeMsg || config.atMsg) {
              handleMsgSound(config, "strong");
            } else {
              handleMsgSound(config, "weak");
            }
          }
        } else {
          // 获取提示通知文字信息
          const rs = await handleMsgContent(data);
          // @我的  @所有人
          if (config.atMeMsg || config.atMsg) {
            // 提示音开关是否开启
            if (config.soundSwitch) {
              if (config.msgMute) {
                this.messageStrong(rs, data.conversationID);
              }
            }
          } else {
            // 提示音开关是否开启
            if (config.soundSwitch) {
              if (config.msgMute) {
                this.messageWeak(rs, data.conversationID);
              }
            }
          }
        }
      } else {
        /**
         * 除纯文本之外的消息通知,
         * **/
        if (data?.payload?.hasOwnProperty("operationType")) {
          // 获取群聊系统消息通知内容
          const systemRs = await handlerSystemMsg(data);
          if (config.soundSwitch) {
            if (config.msgMute) {
              this.messageWeak(systemRs, data.conversationID);
            }
          }
        } else if (data?.payload?.hasOwnProperty("extension")) {
          // 获取群聊系统消息通知内容
          const systemRs = await handlerSystemMsg(data);
          if (config.soundSwitch) {
            if (config.msgMute) {
              this.messageWeak(systemRs, data.conversationID);
            }
          }
        } else {
          // 局部
          if (config.global) {
            // 非当前会话
            if (config.currentConversation) {
              if (config.soundSwitch) {
                if (config.msgMute) {
                  handleMsgSound(config, "weak");
                }
              }
            }
          } else {
            // 获取文件类型的消息通知文本
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
}

/**
 * 提取提示音的公共方法
 * type   提示音分为强类型和弱类型
 * config 获取配置参数
 * config.soundSwitch 提示音开关是否开启
 * config.msgMute     群聊是否开启免打扰
 * **/
function handleMsgSound(config: any, type: any) {
  if (type === "strong") {
    if (config.soundSwitch) {
      if (config.msgMute) {
        const strongEl: HTMLAudioElement = createSoundStrongElement();
        strongEl.play();
      }
    }
  } else if (type === "weak") {
    if (config.soundSwitch) {
      if (config.msgMute) {
        const playElement: HTMLAudioElement = createSoundElement();
        playElement.play();
      }
    }
  }
}
