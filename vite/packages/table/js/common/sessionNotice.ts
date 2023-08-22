import { noticeStore } from "../../store/notice";
import { router } from "../../router";
import { useToast } from 'vue-toastification'
import NoticeToastButton from '../../components/notice/noticeToastButton.vue'
import SystemNoticeToast from '../../components/notice/systemNoticeToast.vue'


const toast = useToast()

export class Notifications {
  /**
  * @param notices 接收消息通知内容
  * **/


  private notices: Notification[] = [];
  private callback?: (notification: Notification) => void;
  constructor() {}


  // 根据不同系统通知获取不同通知内容
  private async classNotice(msg: any) {
    const data = msg.data[0].payload
    const groupName = data.groupProfile?.name || data.groupProfile?.groupID;
    const userName = await this.getUserProfile(msg);
    let info: any; // 接收不同系统通知消息
    switch (data.operationType) {
      case 1:
        if ( data.handleMessage === "加群" && data.hasOwnProperty("handleMessage")) {
          info = `${userName}申请加入群组:${groupName}`;
        } else {
          info = `${userName}接受${msg.nick}加入${groupName}群组`;
        }
        break;
      case 2:
        info = `成功加入群组：${groupName}`;
        break;
      case 3:
        info = `申请加入群组:${groupName}被拒绝`;
        return info;
      case 4:
        info = `你被管理员${userName}踢出群组：${groupName}`;
        break;
      case 5:
        info = `群：${groupName}被${userName} 解散`;
        break;
      case 6:
        info = `${userName} 创建群：${groupName}`;
        break;
      case 8:
        info = `你退出群组：${groupName}`;
        break;
      case 9:
        info = `你被${userName} 设置为群：${groupName} 的管理员`;
        break;
      case 10:
        info = `你被${userName} 撤销群：${groupName} 的管理员身份`;
        break;
      case 12:
        info`${userName} 邀请你加群：${groupName}`;
        break;
      case 13:
        info = `${userName} 同意加群：${groupName}`;
        break;
      case 14:
        info = `${userName} 拒接加群：${groupName}`;
        break;
      case 255:
        info = `自定义群系统通知: ${data.userDefinedField}`;
        break;
      default:
        break;
    }
    return info;
  }


  // 根据参数获取用户名称
  private async getUserProfile(msg: any) {
    // 根据用户名称
    const res = await window.$chat.getUserProfile({
      userIDList: [`${msg.data[0].payload.operatorID}`],
    });
    return res.data[0].nick;
  }


  // 获取群组名称
  private async getGroupName(msg: any) {
    if (msg.conversationType === "GROUP") {
      const res = await window.$chat.getGroupProfile({ groupID: msg.to });
      return res.data.group.name;
    } else {
      return "";
    }
  }

  // 获取群组头像
  private async getGroupAvatar(val:any){
    if(val.data[0].conversationType === 'GROUP'){
      const res = await window.$chat.getGroupProfile({ groupID:val.data[0].to })
      return res.data.group.avatar
    }
  }

  // 普通消息弹窗
  private commonMessage(msg:any,conversationID:any){
    toast.info(
      {
        component:NoticeToastButton,props:{message:msg,messageType:'message',isPlay:noticeStore().$state.noticeSettings.enablePlay},
        listeners:{
          'nowCheck':function(){
            router.push({name:'chat'})
            window.$TUIKit.TUIServer.TUIConversation.getConversationProfile(conversationID).then((imResponse:any) => {
              // 通知 TUIConversation 添加当前会话
              // Notify TUIConversation to toggle the current conversation
              window.$TUIKit.TUIServer.TUIConversation.handleCurrentConversation(imResponse.data.conversation);
            })
            noticeStore().hideNoticeEntry()  
            noticeStore().putIMChatData(msg,'message')
          }
        }
      },
      {
       icon:false,closeOnClick:false, closeButton:false,pauseOnFocusLoss:true, 
       pauseOnHover:true,timeout: 5000,toastClassName:'notice-toast'
      }
    )
    this.notices.push(msg);
    if (this.callback) {
      this.callback(msg)
    }
  }

  // 系统通知弹窗
  private systemNotice(notice:any,conversationID:any){
    toast.info(
      {
        component:SystemNoticeToast,props:{content:notice,noticeType:'notice',isPlay:noticeStore().$state.noticeSettings.noticePlay},
        listeners:{
          'nowCheck':function(){
            router.push({name:'chat'})
            window.$TUIKit.TUIServer.TUIConversation.getConversationProfile(conversationID).then((imResponse:any) => {
              // 通知 TUIConversation 添加当前会话
              // Notify TUIConversation to toggle the current conversation
              window.$TUIKit.TUIServer.TUIConversation.handleCurrentConversation(imResponse.data.conversation);
            })
            noticeStore().hideNoticeEntry()  
            noticeStore().putIMChatData(notice,'Notice')
          }
        }
      },
      {
        icon:false,closeOnClick:false, closeButton:false,pauseOnFocusLoss:true, 
        pauseOnHover:true,timeout: 0,toastClassName:'notice-toast'
      }
    )
    this.notices.push(notice);
    if (this.callback) {
      this.callback(notice);
    }
  }




  // 接收IM聊天消息通知方法
  public async receiveNotification(notification: Notification) {
    // 显示消息入口
    noticeStore().showNoticeEntry()
    

    
    // 判断IM聊天是否切换聊天页面,
    if(router.options.history.state.current !== '/chat' && noticeStore().$state.noticeSettings.enable){

      // 判断消息是否为文本
      const isText = notification.data[0].payload.hasOwnProperty('text')
      if(isText){
        // 好友名称标题
        const friendTitle = notification.data[0].nick ? `${notification.data[0].nick}` : '' 
        // 群组名称标题
        const groupTitle = await this.getGroupName(notification.data[0]) !== '' ?  `${await this.getGroupName(notification.data[0])}` : '' 
        const avatar = await this.getGroupAvatar(notification)
        
        // 定义临时变量将数据进行存储
        const msg = {  
         title:notification.data[0].conversationType === 'C2C' ? friendTitle : groupTitle,
         icon:notification.data[0].conversationType === 'C2C' ? notification.data[0].avatar : avatar,
         body:notification.data[0].payload.text,
         time:notification.data[0].time,
        }
        this.commonMessage(msg,notification.data[0].conversationID)
        
      }else{
        const body = await this.classNotice(notification)   
        const notice = {
          title:'系统通知',
          body:body,
          icon:'/icons/IM.png',
          time:notification.data[0].time
        }
        this.systemNotice(notice,notification.data[0].conversationID)
      }
    }else{
      noticeStore().putIMChatData(msg,'message')
      noticeStore().putIMChatData(notice,'notice')
    }
  }
}
