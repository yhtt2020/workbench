const path = require('path')

export function fixHttp (str, ssl = true) {
  if (!str) {
    return ''
  } else {
    if (str.startsWith('//')) {
      str = ssl ? 'https:'+str : 'http:'+str
      return str
    } else {
      return str
    }
  }
}
export function formatFileSize(size) {
  const units = ["B", "KB", "MB", "GB", "TB"];
  let index = 0;

  while (size >= 1024 && index < units.length-1) {
    size /= 1024;
    index++;
  }

  return size.toFixed(2) + " " + units[index];
}

export function formatSeconds (value) {
  //  秒
  let second = parseInt(value)
  //  分
  let minute = 0
  //  小时
  let hour = 0
  //  天
  //  let day = 0
  //  如果秒数大于60，将秒数转换成整数
  if (second > 60) {
    //  获取分钟，除以60取整数，得到整数分钟
    minute = parseInt(second / 60)
    //  获取秒数，秒数取佘，得到整数秒数
    second = parseInt(second % 60)
    //  如果分钟大于60，将分钟转换成小时
    if (minute > 60) {
      //  获取小时，获取分钟除以60，得到整数小时
      hour = parseInt(minute / 60)
      //  获取小时后取佘的分，获取分钟除以60取佘的分
      minute = parseInt(minute % 60)
      //  如果小时大于24，将小时转换成天
      //  if (hour > 23) {
      //    //  获取天数，获取小时除以24，得到整天数
      //    day = parseInt(hour / 24)
      //    //  获取天数后取余的小时，获取小时除以24取余的小时
      //    hour = parseInt(hour % 24)
      //  }
    }
  }
  let result = ''
  if (second > 0) {
    result = '' + parseInt(second) + '秒'
  }
  if (minute > 0) {
    result = '' + parseInt(minute) + '分' + result
  }
  if (hour > 0) {
    result = '' + parseInt(hour) + '小时' + result
  }
  //  if (day > 0) {
  //    result = '' + parseInt(day) + '天' + result
  //  }
  return result
}

export function getLogo (logo, local_dir, fileProtocol = true) {
  if (logo === 'local') {
    return (fileProtocol ? 'file://' : '') + path.join(local_dir, 'logo.png')
  } else {
    return logo
  }
}

export function getBgColorFromEntry (entry) {
  let color = 'black'
  if (entry) {
    color = entry.bgColor
  }
  return color
}

export function timeStamp (time) {
  let date = new Date(time)
  let dateTime = {}
  let weeks = [
    '星期一',
    '星期二',
    '星期三',
    '星期四',
    '星期五',
    '星期六',
    '星期日',
  ]
  dateTime.year = date.getFullYear()
  dateTime.month = date.getMonth() + 1
  dateTime.day = date.getDate()
  dateTime.hours = date.getHours()

  let minutes = date.getMinutes()

  let seconds = date.getSeconds()

  if (minutes < 10) {
    dateTime.minutes = '0' + String(minutes)
  } else {
    dateTime.minutes = minutes
  }
  if (seconds < 10) {
    dateTime.seconds = '0' + String(seconds)
  } else {
    dateTime.seconds = seconds
  }
  dateTime.week = weeks[date.getDay() - 1]
  return dateTime
}

export function getDateTime (date = new Date()) {
  let dateTime = {}
  let weeks = [
    '星期一',
    '星期二',
    '星期三',
    '星期四',
    '星期五',
    '星期六',
    '星期日',
  ]
  dateTime.year = date.getFullYear()
  dateTime.month = date.getMonth() + 1
  dateTime.day = date.getDate()
  dateTime.hours = date.getHours()

  let minutes = date.getMinutes()

  let seconds = date.getSeconds()

  if (minutes < 10) {
    dateTime.minutes = '0' + String(minutes)
  } else {
    dateTime.minutes = minutes
  }
  if (seconds < 10) {
    dateTime.seconds = '0' + String(seconds)
  } else {
    dateTime.seconds = seconds
  }
  dateTime.week = weeks[date.getDay() - 1]
  return dateTime
}

export function transDate (s, e) {
  let start = new Date(s).getTime()
  let end = new Date(e).getTime()
  var result = Math.abs(end - start)
  var minute = result / 1000 / 60
  if (minute == 0 || isNaN(minute) || minute == null) {
    return 0
  }
  return Math.floor(result / (24 * 3600 * 1000))
}

export const myStore = {
  save (key, value) {
    localStorage.setItem(key, JSON.stringify(value))
  }, /**
   * 读入一个app的数据
   * @param $app
   */
  loadAppData ($app, defaultValue) {
    let saved = localStorage.getItem('appData.' + $app)
    if (saved) {
      let data = JSON.parse(saved)
      return data
    } else {
      return defaultValue
    }
  },
  /**
   * 读入全部的设置
   */
  loadSettings (defaultValue) {
    let saved = localStorage.getItem('settings')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        console.warn('应用设置载入错误，自动使用默认值')
      }
    }
    return defaultValue
  }
}

export function filterObjKeys (obj1, obj2) {
  return Object.keys(obj1).map(i => {
    if (obj2.hasOwnProperty(i)) {
      obj1[i] = obj2[i]
    }
  })
}

export function netWorkDownUp (obj) {
  const a = { down: 0, up: 0 }
  obj &&  Object.keys(obj).forEach(i => {
    if (i.includes('SNIC') && obj[i].value !== '0.0') {
      if (obj[i].label.includes('Down') && obj[i].label.includes('Rate')) a.down = obj[i].value
      if (obj[i].label.includes('Up') && obj[i].label.includes('Rate')) a.up = obj[i].value
    }
  })
  return a
}

export function  initCanvas(refName,list,size,width,color,activeColor) {
  let canvas = this.$refs[refName]
  let ctx = canvas.getContext('2d');
  let x = 0;
  list.forEach((i,index) => {
    ctx.fillStyle=color;
    ctx.fillRect(x ,0,width,width);
    let y= 0;
    let bcolor = 100;
    for (let j = 0; j < size; j++) {
      if(parseInt(i)>=100/size*j&&parseInt(i)<=100/size*(j+1))bcolor =size - j;
    }
    for (let k = 1;k<=size;k++){
      if(bcolor<=k){
        ctx.fillStyle=activeColor;
      }else{
        ctx.fillStyle=color;
      }

      ctx.fillRect(x ,y,width,width);
      y+=width /2;
      y+=width;
    }
    x+=width / 2;
    x+= width;
  })

}

export function formatTimestamp (timestamp) {
  var date = new Date(timestamp);
  var year = date.getFullYear();
  var month = ("0" + (date.getMonth() + 1)).slice(-2);
  var day = ("0" + date.getDate()).slice(-2);
  return year + "-" + month + "-" + day;
}

export function formatTime(dateTimeStamp){

  const minute = 1000 * 60;
  const hour = minute * 60;
  const day = hour * 24;
  const week = day * 7;
  const now = new Date().getTime();
  const diffValue = now - dateTimeStamp;
  let result = '';

  if (diffValue < 0) {
   return;
  }

  const minC = diffValue / minute;
  const hourC = diffValue / hour;
  const dayC = diffValue / day;
  const weekC = diffValue / week;

  if (weekC >= 1 && weekC <= 4) {

    result = ` ${parseInt(`${weekC}`, 10)}周前`;

  }else if (dayC >= 1 && dayC <= 6){

    result = ` ${parseInt(`${dayC}`, 10)}天前`;

  }else if (hourC >= 1 && hourC <= 23){

    result = ` ${parseInt(`${hourC}`, 10)}小时前`;

  }else if (minC >= 1 && minC <= 59){

    result = ` ${parseInt(`${minC}`, 10)}分钟前`;

  }else if (diffValue >= 0 && diffValue <= minute){

    result = '刚刚';

  }else{

    const datetime = new Date();
    datetime.setTime(dateTimeStamp);
    const Nyear = datetime.getFullYear();
    const Nmonth = datetime.getMonth() + 1 < 10 ? `0${datetime.getMonth() + 1}` : datetime.getMonth() + 1;
    const Ndate = datetime.getDate() < 10 ? `0${datetime.getDate()}` : datetime.getDate();
     result = `${Nyear}-${Nmonth}-${Ndate}`;

  }

  return result;

}

