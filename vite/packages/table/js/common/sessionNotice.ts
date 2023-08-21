import { useToast } from 'vue-toastification'
import NoticeToastButton from '../../components/notice/noticeToastButton.vue'
import SystemNoticeToast from '../../components/notice/systemNoticeToast.vue'

import { router } from '../../router'
import { noticeStore } from '../../store/notice'
import { appStore } from '../../store'

const toast = useToast()
export class Notifications{
  /**
   * @param notices 接收消息通知内容
   * **/

  private notices:Notification[] = []
  private groupAvatar:String = ''
  
  private callback?: (notification: Notification) => void;

  constructor() {}

  // 根据不同系统通知显示不同内容
  private async classNotice(msg:any){
    const groupName = msg.payload.groupProfile.name || msg.payload.groupProfile.groupID;

    const userName  = await this.getUserProfile(msg)
    console.log(msg.payload.operationType);

    switch(msg.payload.operationType){
      case 1:
        if(msg.payload.handleMessage === "加群" && msg.payload.hasOwnProperty('handleMessage')){
          return `${userName}申请加入群组:${groupName}`;
        }else{
          return `${userName}接受${msg.nick}加入${groupName}群组`; 
        }
      case 2:
        return `成功加入群组：${groupName}`;
      case 3:
        return `申请加入群组:${groupName}被拒绝`;
      case 4:
        return `你被管理员${userName}踢出群组：${groupName}`;
      case 5:
        return `群：${groupName}被${userName} 解散`;
      case 6:
        return `${userName} 创建群：${groupName}`;
      case 8:
        return `你退出群组：${groupName}`;
      case 9:
        return `你被${userName} 设置为群：${groupName} 的管理员`;
      case 10:
        return `你被${userName} 撤销群：${groupName} 的管理员身份`;
      case 12:
        return `${userName} 邀请你加群：${groupName}`;
      case 13:
        return `${userName} 同意加群：${groupName}`;
      case 14:
        return `${userName} 拒接加群：${groupName}`;
      case 255:
        return `自定义群系统通知: ${msg.payload.userDefinedField}`;
      default:
        break;
    }
  }

  private async getUserProfile(msg) {  // 根据用户名称
    const res = await window.$chat.getUserProfile({userIDList:[`${msg.payload.operatorID}`]})
    return res.data[0].nick
  }

  private async getGroupName(msg) {  // 获取群组名称
    if(msg.conversationType === 'GROUP'){
      const res = await window.$chat.getGroupProfile({groupID:msg.to})
      return res.data.group.name  
    }else{
      return '';
    }
  }


  // 接收IM消息通知方法 
  public async receiveNotification(notification: Notification) {
    noticeStore().showNoticeEntry()

    if(router.options.history.state.current !== '/chat'){ // 判断是否在聊天页面

      // 判断是否为群聊,如果是群聊,根据群聊id获取群聊头像
      if(notification.data[0].conversationType === 'GROUP'){
       const res = await window.$chat.getGroupProfile({ groupID:notification.data[0].to })
       this.groupAvatar = res.data.group.avatar
      }

      if(notification.data[0].payload.hasOwnProperty('text')){  // 判断payload.text是否存在
        if(noticeStore().$state.noticeSettings.enablePlay){  // 判断提示语开关是否打开
          noticeStore().setMessagePlay()  // 打开消息提示语
        }else{
          return;
        }
  
        const friendTitle = notification.data[0].nick ? `${notification.data[0].nick}` : ''  // 好友名称标题
        const groupTitle = await this.getGroupName(notification.data[0]) !== '' ?  `${await this.getGroupName(notification.data[0])}` : '' // 群组名称标题
       
        const msg = {  // 定义临时变量将数据进行存储
          title:notification.data[0].conversationType === 'C2C' ? friendTitle : groupTitle,
          icon:notification.data[0].conversationType === 'C2C' ?  notification.data[0].avatar : this.groupAvatar,
          body:notification.data[0].payload.text,
          time:notification.data[0].time,
        }
  
        if(noticeStore().$state.noticeSettings.enable){ // 判断是否开启消息弹窗
          toast.info(  // 显示通知弹窗
          {
            component:NoticeToastButton,props:{message:msg,messageType:'message'},
            listeners:{
              'nowCheck':function(){  // 立即查看 跳转指定会话
                router.push({name:'chat'})
                const name = `${notification.data[0].conversationID}`
                window.$TUIKit.TUIServer.TUIConversation.getConversationProfile(name).then((imResponse) => {
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
        }else{
          noticeStore().putIMChatData(msg,'message')
        }
  
        this.notices.push(msg);
        if (this.callback) {
          this.callback(msg);
        }
  
      }else{
  
        if(noticeStore().$state.noticeSettings.enablePlay){  // 判断提示语开关是否打开
          noticeStore().setNoticePlay()  // 打开通知提示语
        }else{
          return;
        }
       
  
        const body = await this.classNotice(notification.data[0])
        
        const notice = {
          title:'系统通知',
          body:body,
          icon:'/icons/IM.png',
          time:notification.data[0].time
        }
        
  
        if(noticeStore().$state.noticeSettings.enable){ // 判断是否开启消息弹窗
          toast.info(  // 显示通知弹窗
           {
           component:SystemNoticeToast,props:{content:notice,noticeType:'notice'},
           listeners:{
             'nowCheck':function(){  // 立即查看
                router.push({name:'chat'})
                const name = `${notification.data[0].conversationID}`;
                window.$TUIKit.TUIServer.TUIConversation.getConversationProfile(name).then((imResponse:any) => {
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
        }else{
          noticeStore().putIMChatData(notice,'Notice')
        }
       
        
        this.notices.push(notice);
        if (this.callback) {
          this.callback(notice);
        }
      }
      
    }else{
      return;
    }
  
   

  }
  

  // 接收其他消息通知后续再起一个方法


 



}