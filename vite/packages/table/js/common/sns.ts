import TencentCloudChat from "tim-js-sdk";
import { appStore } from "../../store";
import _ from "lodash-es";

let chat: any;

function getChat() {
  if (!chat) {
    chat = (window as any).$TUIKit.chat || undefined;
  }
}

export async function checkFriendship(uid: any) {
  getChat();
  const app: any = appStore();
  const userInfo = app.userInfo;
  if (uid !== userInfo.uid) {
    //不是本人，则需要验证好友关系
    try {
      let uids: any = [];
      if (typeof uid !== "string" && typeof uid !== "number") {
        uid.forEach((u: any) => {
          uids.push(String(u));
        });
      } else {
        uids = [String(uid)];
      }

      let rs = await chat.checkFriend({
        userIDList: uids,
        type: TencentCloudChat.TYPES.SNS_CHECK_TYPE_SINGLE,
      });
      const { successUserIDList, failureUserIDList } = rs.data;

      function checkFriendship(item: any) {
        const { userID, code, relation } = item;
        if (userID === "@TLS#NOT_FOUND") {
          return "unknown";
        } else {
          if (relation === TencentCloudChat.TYPES.SNS_TYPE_NO_RELATION) {
            return "not";
          } else {
            return "yes";
          }
        }
      }

      if (successUserIDList.length === 1) {
        let item = successUserIDList[0];
        return checkFriendship(item);
      } else {
        let returnArray: any = [];
        successUserIDList.forEach((item: any) => {
          returnArray.push(checkFriendship(item));
        });
        return returnArray;
      }
    } catch (e) {
      return "error";
    }
  } else {
    return "self";
  }
}

export async function checkGroupShip(groupID: any) {
  getChat();
  const { store } = (window as any).$TUIKit?.TUIStore?.storeMap?.group;
  const allGroupList = store.groupList;
  const successArray: any = [];
  try {
    for (let i = 0; i < groupID.length; i++) {
      const id = await groupID[i];
      const index = _.findIndex(allGroupList, function (u:any) {
        return u.groupID === id;
      });
      if (index !== -1) {
        successArray.push("yes");
      } else {
        successArray.push("not");
      }
    }
    return successArray;
  } catch (error) {
    return error;
  }
}
