const utils = {
 // 将时间戳转换成 年月日 时分秒
 changeTime(timeStamp:any){
  const year = new Date(timeStamp).getFullYear();
  const month = new Date(timeStamp).getMonth() + 1;
  const day = new Date(timeStamp).getDay();
  return year + '年' + (month > 10 ? month :  `0${month}`) +'月' + (day > 10 ? day : `0${day}`) + '日';
 } 



}

export default utils;

