import { useToast } from 'vue-toastification'
import NoticeToastButton from '../../components/notice/noticeToastButton.vue';

const toast = useToast()
export class Notifications{
  notifications:{}
  /**
   * @param options 消息通知可选参数配置示例如下: 
   * { 
   *   title:'标题', body:'内容', time:'时间戳', icon:'图标', subtitle:'副标题',
   *   from:'消息通知来源为object默认值可以为null',imageUrl:'图片路径', 
   *   level:'消息通知级别 参数为:low和critical'
   * }
   * **/ 
  sendNotice(options:object): void{
    this.notifications = options
    const { level } = options
    if(level === 'low'){
      toast.info(
        {
          component:NoticeToastButton,
          props:{
            message: options
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
    }else{
      toast.info(
        {
          component:NoticeToastButton,
          props:{
            message: options
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
          timeout:3000,  
        }
      )
    }
  }

  removeNotice(){
    this.notifications = {}
  }

}






//  时间戳转换成 几分钟前、刚刚、昨天、日期等等
export function formatDate(timeVal) {
  // const now = Date.now();
  // const current: any = new Date(timeVal * 1000);
  // const diff = Math.floor((now - current) / 1000); // 转换为秒
  // if (diff < 60) {
  //   return "刚刚";
  // } else if (diff < 3600) {
  //   const minutes = Math.floor(diff / 60);
  //   return `${minutes}分钟前`;
  // } else if (diff < 86400) {
  //   const dateObj = new Date(timeVal);
  //   const hours = dateObj.getHours();
  //   let minutes = dateObj.getMinutes();
  //   let m = minutes < 10 ? `0${minutes}` : minutes;
  //   return `${hours}:${m}`;
  // } else if (diff < 172800) {
  //   const dateObj = new Date(timeVal);
  //   const hours = dateObj.getHours();
  //   let minutes = dateObj.getMinutes();
  //   let m = minutes < 10 ? `0${minutes}` : minutes;
  //   return `昨天 ${hours}:${m}`;
  // } else if (diff < 259200) {
  //   const dateObj = new Date(timeVal);
  //   const hours = dateObj.getHours();
  //   let minutes = dateObj.getMinutes();
  //   let m = minutes < 10 ? `0${minutes}` : minutes;
  //   return `前天 ${hours}:${m}`;
  // } else {
  //   const dateObj = new Date(timeVal * 1000);
  //   const year = dateObj.getFullYear();
  //   let month = dateObj.getMonth() + 1;
  //   let mon = month < 10 ? `0${month}` : month;
  //   let day = dateObj.getDate();
  //   let r = day < 10 ? `0${day}` : day;
  //   const hours = dateObj.getHours();
  //   let minutes = dateObj.getMinutes();
  //   let min = minutes < 10 ? `0${minutes}` : minutes;
  //   return `${year}-${mon}-${r} ${hours}:${min}`;
  // }
}
