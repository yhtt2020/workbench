const util={
  friendlyDate(timeSpan){
      let date = new Date(timeSpan)
      //return date.getFullYear()+'年'+date.getMonth()+'月'+date.getDate()+'日 '+date.getHours()+':'+date.getMinutes()
      let minute = 1000 * 60
      let hour = minute * 60
      let day = hour * 24
      let time1 = new Date().getTime() //当前的时间戳
      let time2 = Date.parse(new Date(timeSpan)) //指定时间的时间戳
      let time = time1 - time2
      let result = null
      if (time < 0) {
        result = `<span style="color: black;font-weight: bold">刚刚</span>`
      } else if (time / day >= 3) {
        result = (date.getMonth()+1) + '月' + date.getDate() + '日 ' + date.getHours() + ':' + date.getMinutes()
      } else if (time / day >= 2) {
        result = '前天' + date.getHours() + ':' + date.getMinutes()
      } else if (time / day >= 1) {
        result = '昨天' + date.getHours() + ':' + date.getMinutes()
      } else if (time / hour >= 1) {
        result = parseInt(time / hour) + '小时前'
      } else if (time / minute >= 1) {
        result = parseInt(time / minute) + '分钟前'
      } else {
        result = `<span style="color: black;font-weight: bold">刚刚</span>`
      }
      return result

  }
}
module.exports=util
