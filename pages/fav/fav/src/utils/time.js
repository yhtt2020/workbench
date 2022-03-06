// /**
//  * 毫秒转换友好的显示格式
//  * 输出格式：21小时28分钟15秒
//  * @param  {[type]} time [description]
//  * @return {[type]}      [description]
//  */
// function timeToDate(time)
// {
//   // 获取当前时间戳
//   var currentTime = parseInt(new Date().getTime()/1000);
//   var diffTime     = currentTime-time;
//   if (null != diffTime && "" != diffTime) {
//     if (diffTime > 60 && diffTime < 60 * 60) {
//       diffTime = parseInt(diffTime / 60.0) + "分钟" + parseInt((parseFloat(diffTime / 60.0) - parseInt(diffTime / 60.0)) * 60) + "秒";
//     }
//     else if (diffTime >= 60 * 60 && diffTime < 60 * 60 * 24) {
//       diffTime = parseInt(diffTime / 3600.0) + "小时" + parseInt((parseFloat(diffTime / 3600.0) -
//           parseInt(diffTime / 3600.0)) * 60) + "分钟" +
//         parseInt((parseFloat((parseFloat(diffTime / 3600.0) - parseInt(diffTime / 3600.0)) * 60) -
//           parseInt((parseFloat(diffTime / 3600.0) - parseInt(diffTime / 3600.0)) * 60)) * 60) + "秒";
//     }
//     else {
//       //超过1天
//       var date = new Date(parseInt(time) * 1000);
//       diffTime = date.getFullYear()+"/"+(date.getMonth()+1)+"/"+date.getDate();
//       //diffTime = parseInt(diffTime) + "秒";
//     }
//   }
//   return diffTime;
// }

/**
 * 毫秒转换友好的显示格式
 * 输出格式：21小时前
 * @param  {[type]} time [description]
 * @return {[type]}      [description]
 */
export function dateStr(date){
  //获取js 时间戳
  var time=new Date().getTime();
  //去掉 js 时间戳后三位，与php 时间戳保持一致
  time=parseInt((time-date*1000)/1000);

  //存储转换值
  var s;
  if(time<60*10){//十分钟内
    return '刚刚';
  }else if((time<60*60)&&(time>=60*10)){
    //超过十分钟少于1小时
    s = Math.floor(time/60);
    return  s+"分钟前";
  }else if((time<60*60*24)&&(time>=60*60)){
    //超过1小时少于24小时
    s = Math.floor(time/60/60);
    return  s+"小时前";
  }else if((time<60*60*24*3)&&(time>=60*60*24)){
    //超过1天少于3天内
    s = Math.floor(time/60/60/24);
    return s+"天前";
  }else{
    //超过3天
    var date2= new Date(parseInt(date) * 1000);
    return date2.getFullYear()+"/"+(date2.getMonth()+1)+"/"+date2.getDate();
  }
}
