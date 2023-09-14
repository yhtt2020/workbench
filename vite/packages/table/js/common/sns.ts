import TencentCloudChat from "tim-js-sdk";
import {appStore} from "../../store";
import _ from 'lodash-es'

let chat

function getChat() {
  if (!chat) {
    chat = window.$TUIKit?.tim || undefined
  }
}

export async function checkFriendship(uid) {
  getChat()
  const userInfo = appStore().userInfo
  if (uid !== userInfo.uid) {
    //不是本人，则需要验证好友关系
    try {
      let uids = []
      if (typeof uid !== 'string' && typeof uid !== 'number') {

        uid.forEach(u => {
          uids.push(String(u))
        })

      } else {
        uids = [String(uid)]
      }

      let rs = await chat.checkFriend({
        userIDList: uids,
        type: TencentCloudChat.TYPES.SNS_CHECK_TYPE_SINGLE
      })
      const {successUserIDList, failureUserIDList} = rs.data


      function checkFriendship(item) {
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
      }

      if (successUserIDList.length === 1) {
        let item = successUserIDList[0]
        return checkFriendship(item)
      } else {
        let returnArray = []
        successUserIDList.forEach(item => {
          returnArray.push(checkFriendship(item))
        })
        return returnArray
      }

    } catch (e) {
      return 'error'
    }
  } else {
    return 'self'
  }
}


export async function checkGroupShip(groupID:any) {
  getChat()
  const res  = await chat.getGroupList()
  const allGroupList = res.data.groupList
  const successArray = []
  try {
    for(let i=0;i<groupID.length;i++){
      const id = await groupID[i]
      const index = _.findIndex(allGroupList,function(u){
        return u.groupID === id
      })
      if(index !== -1){
        successArray.push('yes')
      }else{
        successArray.push('not')
      }
    }
    return successArray
  } catch (error) {
    return error
  }

}
