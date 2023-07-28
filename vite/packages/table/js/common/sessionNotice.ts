/**
 * 时间戳转换成 几分钟前、刚刚、昨天、日期等等
 * **/ 
export function formatDate(timeVal){
  const now = Date.now()
  const diff = Math.floor((now - timeVal) / 1000); // 转换为秒
  if (diff < 60) {
    
    return '刚刚';

  } else if (diff < 3600) {

    const minutes = Math.floor(diff / 60);
    return `${minutes}分钟前`;

  } else if (diff < 86400) {

    const dateObj = new Date(timeVal);
    const hours = dateObj.getHours();
    let minutes = dateObj.getMinutes();
    let m = minutes < 10 ? `0${minutes}`:minutes
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
    let m  = minutes < 10 ? `0${minutes}` : minutes;
    return `前天 ${hours}:${m}`;
  } else {
    const dateObj = new Date(timeVal);
    const year = dateObj.getFullYear();
    let month = dateObj.getMonth() + 1;
    let mon = month < 10 ? `0${month}` : month;
    let day = dateObj.getDate()
    let r  = day < 10 ? `0${day}` : day;
    const hours = dateObj.getHours();
    let minutes = dateObj.getMinutes();
    let min = minutes < 10 ? `0${minutes}` : minutes;
    return `${year}-${mon}-${r} ${hours}:${min}`;
  }
  
}