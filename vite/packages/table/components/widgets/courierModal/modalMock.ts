export const courierDetailList = [
 {
  goodName:'《悲惨世界》图书',
  time:'2023年10月23日 19:23',
  summary:'快件在【北京环铁站】装车,正发往【北京分拨中心】',
  id:'100223233366223',
  shipWay:'顺丰快递',
  orderID:'SF00003618100',  
  status:'collect',
  icon:'fluent-emoji:blue-book',
  flowDetail:[
   {
    title:'已揽收',
    time:'2023年10月22日 19:23',
    content:'快件在【北京环铁站】装车,正发往【北京分拨中心】',
    status:'0'
   }
  ]
 }, 
 {
  goodName:'IKEA宜家沙发',
  time:'2023年10月22日 19:23',
  summary:'快件在「浙江陆运枢纽杭州」完成分拣，准备发往「嘉兴中通分拨」，根据规划班次预计发出时间「10月23日…',
  id:'100223233366225',
  shipWay:'中通快递',
  status:'enRoute',
  orderID:'SF00003618100',  
  icon:'fluent-emoji:couch-and-lamp',
  flowDetail:[
   {
    title:'运输中',
    time:'2023年10月22日 19:23',
    content:'快件在「浙江陆运枢纽杭州」完成分拣，准备发往「嘉兴中通分拨」，根据规划班次预计发出时间「10月23日凌晨」',
    status:'0'
   },
   {
    time:'2023年10月22日 19:23',
    content:'快件到达【威海】,上一站是【青州分拨中心】',
   },
   {
    title:'已揽收',
    time:'2023年10月22日 19:23',
    content:'快件在【北京环铁站】装车,正发往【北京分拨中心】',
    status:'0'
   }
  ],
 },
 {
  goodName:'YSL口红',
  time:'2023年10月22日 19:23',
  summary:'快件在【北京分拨中心】装车,正发往【青州分拨中心】',
  id:'10022323336620',
  shipWay:'韵达快递',
  orderID:'SF00003618100',  
  status:'enRoute',
  icon:'fluent-emoji:lipstick',
  flowDetail:[
   {
    title:'运输中',
    time:'2023年10月22日 19:23',
    content:'快件在「浙江陆运枢纽杭州」完成分拣，准备发往「嘉兴中通分拨」，根据规划班次预计发出时间「10月23日凌晨」',
    status:'0'
   },
   {
    time:'2023年10月22日 19:23',
    content:'快件到达【威海】,上一站是【青州分拨中心】',
   },
   {
    title:'已揽收',
    time:'2023年10月22日 19:23',
    content:'快件在【北京环铁站】装车,正发往【北京分拨中心】',
    status:'0'
   }
  ],
 },
 {
  goodName:'SONY XM5 头戴式耳机',
  time:'2023年10月22日 19:23',
  summary:'【威海】的【王奕凯】正在派件',
  id:'10022323336621',
  orderID:'SF00003618100',  
  shipWay:'中通快递',
  status:'delivery',
  icon:'fluent-emoji:headphone',
  flowDetail:[
   {
    title:'派送中',
    time:'2023年10月22日 19:23',
    content:'【威海】的【王奕凯】正在派件',
    status:'0'
   },
   {
    title:'运输中',
    time:'2023年10月22日 19:23',
    content:'快件在「浙江陆运枢纽杭州」完成分拣，准备发往「嘉兴中通分拨」，根据规划班次预计发出时间「10月23日凌晨」',
    status:'0'
   },
   {
    time:'2023年10月22日 19:23',
    content:'快件到达【威海】,上一站是【青州分拨中心】',
   },
   {
    title:'已揽收',
    time:'2023年10月22日 19:23',
    content:'快件在【北京环铁站】装车,正发往【北京分拨中心】',
    status:'0'
   }
  ],
 },
 { 
  goodName:'SF00003618100',
  time:'2023年10月22日 19:23',
  summary:'您的快件已签收，如有疑问请电联系「王海，电话156788888888」，感谢您使用顺丰，期待再次为您服务。（主单总件数：1件）',
  id:'10022323336600',
  orderID:'SF00003618100',
  shipWay:'顺丰快递',
  status:'signed',
  icon:'fluent-emoji:package',
  flowDetail:[
   {
    title:'已签收',
    type:'sign',
    time:'2023年10月22日 19:23',
    content:'您的快件已签收，如有疑问请电联系「王海，电话156788888888」，感谢您使用顺丰，期待再次为您服务。（主单总件数：1件）',
    status:'0'
   },
   {
    title:'派送中',
    time:'2023年10月22日 19:23',
    content:'【威海】的【王奕凯】正在派件',
    status:'0'
   },
   {
    title:'运输中',
    time:'2023年10月22日 19:23',
    content:'快件在「浙江陆运枢纽杭州」完成分拣，准备发往「嘉兴中通分拨」，根据规划班次预计发出时间「10月23日凌晨」',
    status:'0'
   },
   {
    title:'',
    time:'2023年10月22日 19:23',
    content:'快件到达【威海】,上一站是【青州分拨中心】'
   },
   {
    title:'已揽收',
    time:'2023年10月22日 19:23',
    content:'快件在【北京环铁站】装车,正发往【北京分拨中心】',
    status:'0'
   },
  ]
 },
]


export const courierType = [
 {title:'全部',name:'all'},
 {title:'已揽收',name:'collect',color:'rgba(67,202,222,1)'},
 {title:'在途中',name:'enRoute',color:'var(--active-bg)'},
 {title:'派送中',name:'delivery',color:'var(--warning)'},
 {title:'已签收',name:'signed',color:'var(--success)'}
]