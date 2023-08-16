import TencentCloudChat from "tim-js-sdk";
import {appStore} from "../../store";

let chat
function getChat(){
  if(!chat){
    chat= window.$TUIKit?.tim ||undefined
  }
}

export async function checkFriendship(uid) {
  getChat()
  const userInfo = appStore().userInfo
  if (uid !== userInfo.uid) {
    //不是本人，则需要验证好友关系
    console.log('需要检查')
    try {
      console.log([String(uid)])
      let rs = await chat.checkFriend({
        userIDList: [String(uid)],
        type: TencentCloudChat.TYPES.SNS_CHECK_TYPE_SINGLE
      })
      const {successUserIDList, failureUserIDList} = rs.data
      let item = successUserIDList[0]
      const {userID, code, relation} = item
      if (userID === '@TLS#NOT_FOUND') {
        return 'unknown'
      } else {
        if (relation === TencentCloudChat.TYPES.SNS_TYPE_NO_RELATION) {
          return 'not'
        } else {
          return 'yes'
        }
      }
    } catch (e) {
      return 'error'
    }
  } else {
    return 'self'
  }
}
