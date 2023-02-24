
function getDateTime(date=new Date()){
  let dateTime={}
  let  weeks=['星期一','星期二','星期三','星期四','星期五','星期六','星期日']
  dateTime.year=date.getFullYear()
  dateTime.month=date.getMonth()+1
  dateTime.day=date.getDate()
  dateTime.hours=date.getHours()

  let minutes=date.getMinutes()
  if(minutes<10){
    dateTime.minutes='0'+String(minutes)
  }else{
    dateTime.minutes=minutes
  }
  dateTime.week=weeks[date.getDay()-1]
  return dateTime
}

export  {
  getDateTime
}
