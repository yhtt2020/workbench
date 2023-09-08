export const chatList = [
 {
  name:'想天工作台官方社群',
  summary:'欢迎加入想天工作台官方社群，在这里您可以了解到和产品有关的一切',
  props:{
   enableColumns:false,
  },
  commonUse:[
   {
    role:'gossip',
    name:'常用',
    props:{},
    children:[
     {
      role:'gossip',type:'message',title:'闲话畅聊', props:{ gossipID:''}
     },
     {
      role:'gossip', type:'message', title:'直面开发团队', props:{ gossipID:''}
     },
     {
      role:'gossip', type:'link', title:'阿皮动态',
      props:{
       gossipID:'',
       url:'https://space.bilibili.com/167397379/video'
      }
     },
     {
      role:'gossip',type:'link',title:'B站视频',
      props:{
       gossipID:'',
       url:'https://space.bilibili.com/167397379/dynamic'
      }
     }
    ]
   },
   {
    role:'product',
    name:'产品相关',
    props:{},
    children:[
     { role:'product',title:'新手入门',type:'app',props:{},},
     { role:'product',title:'版本更新',type:'app',props:{},},
     { role:'product',title:'Bug反馈',type:'message',props:{}, },
     { role:'product',title:'功能建议',type:'message',props:{}, },
     { role:'product',title:'开发计划公示',type:'link',props:{url:''} },
    ]
   },
   {
    role:'communication',
    name:'交流群',
    props:{},
    children:[
     { role:'communication',title:'官方运营',type:'message',props:{} },
     { role:'communication',title:'圈住交流',type:'message',props:{} },
     { role:'communication',title:'开发者交流',type:'message',props:{} },
    ]
   }
  ]
 }
]
