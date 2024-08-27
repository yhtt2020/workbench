import { usePlat } from "./ui/hooks/usePlat"
let path
if (usePlat('client')) {
 path = require('path')
}

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

// 导出一个函数，用于处理时间戳
export function timeStamp (time) {
  // 创建一个新的日期对象
  let date = new Date(time)
  // 创建一个日期时间对象
  let dateTime = {}
  // 创建一个星期数组
  let weeks = [
    '星期一',
    '星期二',
    '星期三',
    '星期四',
    '星期五',
    '星期六',
    '星期日',
  ]
  // 获取年份
  dateTime.year = date.getFullYear()
  // 获取月份
  dateTime.month = date.getMonth() + 1
  // 获取日期
  dateTime.day = date.getDate()
  // 获取小时
  dateTime.hours = date.getHours()
  // 获取分钟
  let minutes = date.getMinutes()
  // 获取秒
  let seconds = date.getSeconds()
  // 判断分钟是否小于10
  if (minutes < 10) {
    // 小于，则添加0
    dateTime.minutes = '0' + String(minutes)
  } else {
    // 大于等于，则直接赋值
    dateTime.minutes = minutes
  }
  // 判断秒是否小于10
  if (seconds < 10) {
    // 小于，则添加0
    dateTime.seconds = '0' + String(seconds)
  } else {
    // 大于等于，则直接赋值
    dateTime.seconds = seconds
  }
  // 获取星期
  dateTime.week = weeks[date.getDay() - 1]
  // 返回日期时间对象
  return dateTime
}

// 导出一个函数，用于获取当前日期和时间
export function getDateTime (date = new Date()) {
  // 创建一个日期时间对象
  let dateTime = {}
  // 定义一个星期数组
  let weeks = [
    '星期一',
    '星期二',
    '星期三',
    '星期四',
    '星期五',
    '星期六',
    '星期日',
  ]
  // 获取当前年份
  dateTime.year = date.getFullYear()
  // 获取当前月份
  dateTime.month = date.getMonth() + 1
  // 获取当前日期
  dateTime.day = date.getDate()
  // 获取当前小时
  dateTime.hours = date.getHours()
  // 获取当前分钟
  let minutes = date.getMinutes()
  // 获取当前秒数
  let seconds = date.getSeconds()
  // 如果分钟数小于10，则将分钟数转换为两位数
  if (minutes < 10) {
    dateTime.minutes = '0' + String(minutes)
  } else {
    dateTime.minutes = minutes
  }
  // 如果秒数小于10，则将秒数转换为两位数
  if (seconds < 10) {
    dateTime.seconds = '0' + String(seconds)
  } else {
    dateTime.seconds = seconds
  }
  // 获取当前星期
  dateTime.week = weeks[date.getDay() - 1]
  // 返回日期时间对象
  return dateTime
}

// 导出一个函数，用于转换日期
export function transDate (s, e) {
  // 将输入的日期转换为时间戳
  let start = new Date(s).getTime()
  let end = new Date(e).getTime()
  // 计算两个日期之间的差值
  var result = Math.abs(end - start)
  // 将差值转换为分钟
  var minute = result / 1000 / 60
  // 如果没有分钟，或者结果是NaN，或者结果是null，则返回0
  if (minute == 0 || isNaN(minute) || minute == null) {
    return 0
  }
  // 将差值转换为天
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

export function formatTimestamp (timestamp, type) {
  // type 为true时额外多一个时分
  var date = new Date(timestamp);
  var year = date.getFullYear();
  var month = ("0" + (date.getMonth() + 1)).slice(-2);
  var day = ("0" + date.getDate()).slice(-2);
  var hour = ("0" + date.getHours()).slice(-2);
  var minutes = ("0" + date.getMinutes()).slice(-2);
  if (type) {
    return year + "-" + month + "-" + day + ' ' + hour + ':' + minutes
  }else{
    return year + "-" + month + "-" + day;
  }

}

// 导出一个函数，用于格式化时间
export function formatTime(dateTimeStamp:any){
  // 创建一个当前时间的新对象
  const currentTime:any = new Date();
  // 将时间戳转换为日期对象
  const dateStr = new Date(dateTimeStamp * 1000);
  // 计算时间差，单位为秒
  const seconds = Math.floor((currentTime.getTime() - dateStr) / 1000);
  // 计算时间差，单位为月
  const interval = Math.floor(seconds / 31536000);
  // 如果间隔大于一个月，则返回日期字符串
  if (interval > 1) return dateStr.toLocaleString();
  // 如果间隔等于一个月，则返回日期字符串
  if (interval === 1)  return dateStr.toLocaleDateString();
  // 如果间隔小于一分钟，则返回“刚刚”
  if (seconds < 60) return "刚刚";
  // 如果间隔小于一个小时，则返回“xx 分钟前”
  if (seconds < 3600) return Math.floor(seconds / 60) + " 分钟前";
  // 如果间隔小于一个天，则返回“xx 小时前”
  if (seconds < 86400) return Math.floor(seconds / 3600) + " 小时前";
  // 如果间隔小于一个星期，则返回“xx 天前”
  if (seconds < 604800)  return Math.floor(seconds / 86400) + " 天前";
  // 如果间隔小于一个月，则返回“xx 周前”
  if (seconds < 2419200) return Math.floor(seconds / 604800) + " 周前";
}


export const getHostAddress = (urlString) => {
  const regex = /^(https?:\/\/[^/?#]+).*$/;
  const match = urlString.match(regex);
  if (match && match.length >= 2) {
    return match[1];
  }
  return urlString;
};
