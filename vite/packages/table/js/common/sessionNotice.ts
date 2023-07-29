import { useToast } from "vue-toastification";
import { notification } from "ant-design-vue";
import NoticeToastButton from '../../components/notice/noticeToastButton.vue'

/** 
 * @param enable 是否打开消息通知
 * @param config 消息通知内容配置项
 * @param urgency 消息通知级别   normal critical low
 * **/ 

const toast = useToast()

declare interface NoticeOptions{
  urgency: string;
  enable:boolean, 
  config:{
    title:string, // 标题
    body:string, // 正文
    icon: string, // 图片路径
    time:number, // 获取消息发送时间
  }
}

export class NotificationManager{
  notifications:{}
  enable:boolean
  config:object
  urgency:string
  
  constructor(config:NoticeOptions ,enable:boolean,urgency:string){
    this.config = config
    this.urgency = urgency
    this.enable = enable
  }

  
  // 消息通知发送
  sendNotification(): void{
    this.notifications = this.config
    if(this.enable){
      if(this.urgency === 'critical'){  // 最高级别消息通知
        
      }else if(this.urgency === 'normal'){  // 普通级别消息通知
        
      }else if(this.urgency === 'low'){  // 最低级别消息通知
        toast.info (
          {
            component:NoticeToastButton,
            props:{
              message:this.notifications
            },
            listeners:{

            }
          },
          {
            icon:false,
            closeOnClick:false,
            closeButton:false,
            pauseOnFocusLoss:false,
            pauseOnHover:false,
            timeout: 0,
          }
        )
      }
    }
  }

  // 全部消息通知清空
  removeAllNotification(){
    this.notifications = {}
  }

  // 删除指定消息通知
  removeNotification(){
    
  }

  
}