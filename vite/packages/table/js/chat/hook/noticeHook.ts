import _ from "lodash-es";
import { appStore } from "../../../store";
import { storeToRefs } from "pinia";

/**
 * 解析群聊消息纯文本
 * @param data 数据
 * **/
export const handleMsgContent = async (data: any) => {
  // 解析当前群聊消息私聊或者群聊发送的类型
  const handleType = data.conversationType;
  /**私聊**/
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
  } else if (handleType === "GROUP") {
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
};
// 获取纯文本消息内容,返回字符串
function getTextMsgContent(data: any) {
  return `${data.nick}：${data.payload.text}`;
}

/**
 * 解析群聊文件消息
 * @param data 数据
 * **/
export const handlerMesFileContent = async (data: any) => {
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
};
/**获取文件发送提示信息的描述**/
function getMsgFileData(data: any) {
  // 文件
  if (data?.payload?.hasOwnProperty("downloadFlag")) {
    if (data?.payload?.fileName) {
      return `${data?.nick}发送了一个文件: ${data?.payload?.fileName}`;
    } else {
      return `${data?.nick}发送了一个文件`;
    }
  }
  // 图片
  else if (data?.payload?.hasOwnProperty("imageFormat")) {
    return `${data?.nick}发送了一张图片文件`;
  }
  // 视频
  else if (data?.payload?.hasOwnProperty("videoFormat")) {
    return `${data?.nick}发送了一视频文件`;
  }
}

/**
 * 解析群聊系统消息通知
 * @param data 数据
 * **/
export const handlerSystemMsg = async (data: any) => {

  const systemTextRs = await getSystemMsgText(data);
  // 获取群聊列表
  const groupRs = await (window as any).$TUIKit?.chat?.getGroupList();
  const groupList = groupRs?.data?.groupList;
  const found = _.find(groupList, (item: any) => {
    return String(item.groupID) === String(data.to);
  });

  // 需要的参数
  const systemTextContent = {
    icon: found?.avatar ? found?.avatar : 'https://web.sdk.qcloud.com/im/assets/images/Public.svg',
    title: found?.name ? found?.name : data?.payload?.groupProfile?.name,
    body: systemTextRs,
    conversationID: data.conversationID,
    time: data.time,
    type: "message",
  };

  return systemTextContent;
};
/**
 *获取群聊系统消息通知
 * 例如:
 * 群聊加入、群聊申请加入、退出群聊、发布新公告、同意xxx加入群聊、创建群聊、
 * 解散群聊、邀请入了和加入群聊在IM文档是同一个提示、
 * **/
async function getSystemMsgText(data: any) {
  // 获取类型
  const getOperationType = data?.payload?.operationType;
  const dataPayload = data?.payload;
  const payloadFile = data?.payload?.groupProfile;

  // 获取自己用户的uid
  const { userInfo } = storeToRefs(appStore() as any);
  // 获取用户昵称
  let nickRs: any;
  // 判断是不是和自己的uid相同
  if (Number(dataPayload?.operatorID) === Number(userInfo.value?.uid)) {
    nickRs = await (window as any).$TUIKit?.chat?.getUserProfile({
      userIDList: [`${userInfo.value?.uid}`],
    });
  } else {
    nickRs = await (window as any).$TUIKit?.chat?.getUserProfile({
      userIDList: [data?.payload?.operatorID],
    });
  }
  const nickName = nickRs?.data[0]?.nick;

  // 群聊申请加入
  if (dataPayload?.hasOwnProperty("authentication") && getOperationType === 1) {
    return `${nickName}: 申请加入 ${
      payloadFile?.name ? payloadFile?.name : payloadFile?.groupName
    } 群聊`;
  }

  // 退出群聊
  else if (
    dataPayload?.operationType === 2 &&
    Number(dataPayload?.operatorID) !== Number(userInfo.value?.uid)
  ) {
    return `${nickName}: 退出 ${payloadFile?.groupName} 群聊`;
  }

  //  加入群聊
  else if (
    dataPayload?.operationType === 1 &&
    Number(dataPayload?.operatorID) !== Number(userInfo.value?.uid)
  ) {
    return `${nickName}: 加入 ${
      payloadFile?.name ? payloadFile?.name : payloadFile?.groupName
    } 群聊`;
  }

  // 某某人同意某某人加入群聊
  else if (
    dataPayload?.operationType === 1 &&
    Number(dataPayload?.operatorID) === Number(userInfo.value?.uid)
  ) {
    return `群管理员 同意 ${data?.nick} 加入 ${
      payloadFile?.name ? payloadFile?.name : payloadFile?.groupName
    }群聊`;
  }

  // 创建群聊
  else if (dataPayload?.hasOwnProperty("extension")) {
    const changeData = JSON.parse(dataPayload?.data);
    return `${changeData?.opUser}: ${changeData?.content}`;
  }

  // 解散群聊
  else if (dataPayload?.operationType === 5) {
    return `${nickName}: 解散 ${
      payloadFile?.name ? payloadFile?.name : payloadFile?.groupName
    } 群聊`;
  }
}

/**
 * 创建音频强提醒
 * **/
export function createSoundStrongElement(): HTMLAudioElement {
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

/**
 *  创建音频播放组件
 * **/
export function createSoundElement(): HTMLAudioElement {
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
