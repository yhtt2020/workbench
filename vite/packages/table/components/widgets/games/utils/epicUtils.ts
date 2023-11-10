// 判断本周的方法
export function thisWeek() {
 // 获取当前日期
 const currentDate = new Date()

 // 本周开始时间
 const thisWeekStart = new Date(currentDate)
 thisWeekStart.setDate(currentDate.getDate()-currentDate.getDay() + 1)

 // 本周结束时间
 const thisWeekEnd = new Date(currentDate)
 thisWeekEnd.setDate(currentDate.getDate() + (7-currentDate.getDay()))

 return {
  startDate:thisWeekStart,
  endDate:thisWeekEnd
 }
}


// 判断下周的方法
export function nextWeek() {
 // 获取当前日期
 const currentDate = new Date()

 // 获取本周最后一天
 const thisWeekEnd = new Date(currentDate)
 thisWeekEnd.setDate(currentDate.getDate() + (7-currentDate.getDay()))
 
 const nextWeekStart = new Date(thisWeekEnd)
 nextWeekStart.setDate(thisWeekEnd.getDate() + 1);

 const nextWeekEnd = new Date(nextWeekStart)
 nextWeekEnd.setDate(nextWeekStart.getDate() + 7)

 return {
  startDate:nextWeekStart,
  endDate:nextWeekEnd
 }
 
}


// 计算剩余多少天
export function remainderDays(data:any){
 const startDate = new Date(data.startDate)
 const endDate = new Date(data.endDate)
 const currentDate = new Date();
 const timeDiffStart = Math.abs(currentDate.getTime() - startDate.getTime())  // 开始天数
 const timeDiffEnd = Math.abs(currentDate.getTime() - endDate.getTime()) // 结束天数
 const diffDayStart = Math.ceil(timeDiffStart / (1000 * 3600* 24))
 const diffDayEnd = Math.ceil(timeDiffEnd / (1000 * 3600* 24))

 return {start:diffDayStart,end:diffDayEnd}
 
}