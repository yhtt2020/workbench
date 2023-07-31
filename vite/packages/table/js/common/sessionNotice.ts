/**
 * @param id 生成消息通知的id
 * @param content 消息通知内容
 * **/ 
declare interface Notification{
  id:number,  
  content:object
}

export class NotificationManager{   //  消息通知管理类
  notifications:Notification[] = []
  sendNotifications(id:number,content:any){  // 发送消息通知
    const notification: Notification = { id,content,}
    this.notifications.push(notification)
  }

  removeAllNotifications(): void{  // 清空所有消息通知
    this.notifications = []
  }

}






//  时间戳转换成 几分钟前、刚刚、昨天、日期等等
export function formatDate(timeVal) {
  const now = Date.now();
  const current: any = new Date(timeVal * 1000);
  const diff = Math.floor((now - current) / 1000); // 转换为秒
  if (diff < 60) {
    return "刚刚";
  } else if (diff < 3600) {
    const minutes = Math.floor(diff / 60);
    return `${minutes}分钟前`;
  } else if (diff < 86400) {
    const dateObj = new Date(timeVal);
    const hours = dateObj.getHours();
    let minutes = dateObj.getMinutes();
    let m = minutes < 10 ? `0${minutes}` : minutes;
    return `${hours}:${m}`;
  } else if (diff < 172800) {
    const dateObj = new Date(timeVal);
    const hours = dateObj.getHours();
    let minutes = dateObj.getMinutes();
    let m = minutes < 10 ? `0${minutes}` : minutes;
    return `昨天 ${hours}:${m}`;
  } else if (diff < 259200) {
    const dateObj = new Date(timeVal);
    const hours = dateObj.getHours();
    let minutes = dateObj.getMinutes();
    let m = minutes < 10 ? `0${minutes}` : minutes;
    return `前天 ${hours}:${m}`;
  } else {
    const dateObj = new Date(timeVal * 1000);
    const year = dateObj.getFullYear();
    let month = dateObj.getMonth() + 1;
    let mon = month < 10 ? `0${month}` : month;
    let day = dateObj.getDate();
    let r = day < 10 ? `0${day}` : day;
    const hours = dateObj.getHours();
    let minutes = dateObj.getMinutes();
    let min = minutes < 10 ? `0${minutes}` : minutes;
    return `${year}-${mon}-${r} ${hours}:${min}`;
  }
}
