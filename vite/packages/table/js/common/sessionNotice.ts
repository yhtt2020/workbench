import { useToast } from 'vue-toastification'
import NoticeToastButton from '../../components/notice/noticeToastButton.vue'

const toast = useToast()
export class Notifications{
  /**
   * @param notices 接收消息通知内容
   * **/

  private notices:Notification[] = []
  private groupAvatar:String = ''
  
  private callback?: (notification: Notification) => void;

  constructor() {}

  // 接收消息通知方法 
  public async receiveNotification(notification: Notification) {
    console.log('接收消息通知::>>>',notification.data[0]);
    
    // 判断是否为群聊,如果是群聊,根据群聊id获取群聊头像
    if(notification.data[0].conversationType === 'GROUP'){
      const res = await window.$chat.getGroupProfile({ groupID:notification.data[0].to })
      this.groupAvatar = res.data.group.avatar
    }
    

    if(notification.data[0].payload.hasOwnProperty('text')){
      const msg = {  // 定义临时变量将数据进行存储
        title:notification.data[0].conversationType === 'C2C' ? '好友消息':'群聊消息',
        icon:notification.data[0].conversationType === 'C2C' ?  notification.data[0].avatar : this.groupAvatar,
        body:notification.data[0].payload.text,
        time:notification.data[0].time,
      }

      toast.info(  // 显示通知弹窗
        {
          component:NoticeToastButton,props:{message:msg},
          listeners:{
           
          }
        },
        {icon:false,closeOnClick:false, closeButton:false,pauseOnFocusLoss:true, pauseOnHover:true,timeout: 5000,}
      )

      this.notices.push(msg);
      if (this.callback) {
        this.callback(msg);
      }
    }else{
      console.log('系统通知',notification.data[0]);
    }
    
    
    // const { type } = notification
    // if(type === 'low'){
     
    // }else{

    // }
    
  }



}