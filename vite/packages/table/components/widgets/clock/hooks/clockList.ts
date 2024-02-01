export const clockSelectList = [
 {
  name:'样式1',
  value:"font-family: '优设标题黑' !important;"
 },
 {
  name:'样式2',
  value:"font-family: 'Typefesse-Pleine' !important;",
 },
 {
  name:'样式3',
  value:"font-family: 'LLPixelFun-Regular' !important;"
 },
 {
  name:'样式4',
  value:"font-family: 'Ouroboros-Regular' !important;"
 },
 {
  name:'样式5',
  value:"font-family: 'Pilowlava-Regular' !important;"
 }
]

export const clockTabList = [
 { name:"自定义字体",value:"font" },
 { name:"其他样式",value:"style" }
]

export function dateTimeStamp(timestamp:any){
 const date = new Date(timestamp);
 const year = date.getFullYear();
 const month = date.getMonth() + 1; // 月份是从0开始的，所以要加1
 const day = date.getDate();
 const weekDay = date.getDay(); // 星期几，0表示星期日，1表示星期一，以此类推
 const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
 const formattedDate = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
 const formattedWeekDay = weekDays[weekDay];
 return month + "月" + day + "日"+ "  " + formattedWeekDay;
}