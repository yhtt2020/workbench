export const courierDetailList = [
 {
  goodName:'《悲惨世界》图书',
  time:'2023年10月23日 19:23',
  goodDescription:'快件在【北京环铁站】装车,正发往【北京分拨中心】',
  id:'100223233366223',
  shipWay:'顺丰快递',
  status:'collect',
  icon:'fluent-emoji:blue-book'
 }, 
 {
  goodName:'IKEA宜家沙发',
  time:'2023年10月22日 19:23',
  goodDescription:'快件在「浙江陆运枢纽杭州」完成分拣，准备发往「嘉兴中通分拨」，根据规划班次预计发出时间「10月23日…',
  id:'100223233366225',
  shipWay:'中通快递',
  status:'enRoute',
  icon:'fluent-emoji:couch-and-lamp'
 },
 {
  goodName:'YSL口红',
  time:'2023年10月22日 19:23',
  goodDescription:'快件在【北京分拨中心】装车,正发往【青州分拨中心】',
  id:'10022323336620',
  shipWay:'韵达快递',
  status:'enRoute',
  icon:'fluent-emoji:lipstick'
 },
 {
  goodName:'SONY XM5 头戴式耳机',
  time:'2023年10月22日 19:23',
  goodDescription:'【威海】的【王奕凯】正在派件',
  id:'10022323336621',
  shipWay:'中通快递',
  status:'delivery',
  icon:'fluent-emoji:headphone'
 },
 {
  goodName:'SF00003618100',
  time:'2023年10月22日 19:23',
  goodDescription:'您的快件已签收，如有疑问请电联系「王海，电话156788888888」，感谢您使用顺丰，期待再次为您服务。（主单总件数：1件）',
  id:'10022323336600',
  shipWay:'顺丰快递',
  status:'signed',
  icon:'fluent-emoji:package'
 },
]


export const courierType = [
 {title:'全部',name:'all'},
 {title:'已揽收',name:'collect',color:'rgba(67,202,222,1)'},
 {title:'在途中',name:'enRoute',color:'var(--active-bg)'},
 {title:'派送中',name:'delivery',color:'var(--warning)'},
 {title:'已签收',name:'signed',color:'var(--success)'}
]