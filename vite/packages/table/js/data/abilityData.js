// export default [
//   {icon:'image',name:'锁屏壁纸',detail:'静态壁纸'},
//   {icon:'smile',name:'弹幕',detail:'静态壁纸'},
//   {icon:'thunderbolt',name:'快捷指令',detail:'5组'},
//   {icon:'team',name:'团队',detail:'仅加入'},
//   {icon:'linechart',name:'数据监控助手',detail:'同时监控3个'},
//   {icon:'appstore',name:'自定义底部导航',detail:''},
//   {icon:'pause',name:'自定义侧边导航',detail:''},
//   {icon:'desktop',name:'主页面壁纸',detail:''},
//   {icon:'comment',name:'关闭聊天',detail:''},
// ]
export const leveList = [0,1,2,3,5,10]
export const powerList = [
  {icon:'image',name:'lockWallpaper',alias:'锁屏壁纸',detail:{
      0:'静态壁纸',1:'静态壁纸',2:'动态壁纸',3:'动态壁纸',5:'动态壁纸',10:'动态壁纸'}
  },
  {icon:'smile',name:'barrage',alias:'弹幕',detail: {
      0:'发弹幕',1:'发弹幕',2:'发弹幕',3:'发弹幕',5:'关闭弹幕',10:'关闭弹幕'}
  },
  {icon:'thunderbolt',name:'quickInstructions',alias:'快捷指令',detail: {
      0:'5组',1:'5组',2:'自定义指令',3:'自定义指令',5:'10组',10:'10组'},superiorLimit:{
      0:5,1:5,2:5,3:5,5:10,10:10
    }
  },
  {icon:'chengyuan',name:'group',alias:'团队',detail: {
      0:'仅加入',1:'创建团队',2:'创建团队',3:'创建团队',5:'创建团队',10:'创建团队'}
  },
  {icon:'team',name:'team',alias:'小队',detail: {
      0:'仅加入',1:'仅加入',2:'仅加入',3:'创建小队',5:'创建小队',10:'创建小队'}
  },
  {icon:'linechart',name:'dataMonitoring',alias:'数据监控助手',detail: {
      1:'同时监控3个',2:'同时监控3个',3:'同时监控3个',5:'同时监控5个',10:'不限制'},superiorLimit:{
      1:3,2:3,3:3,5:5,10:Infinity
    }
  },
  {icon:'appstore',name:'bottomNavigation',alias:'自定义底部导航',detail:{
      2:' ',3:' ',5:' ',10:' '}
  },
  {icon:'pause',name:'sideNavigation',alias:'自定义侧边导航',detail:{
      3:' ',5:' ',10:' '
    },noOnline:true},
  {icon:'comment',name:'closeChat',alias:'轻聊',detail:{
      5:'关闭聊天',10:'关闭聊天'}
  },
  {icon:'desktop',name:'mainWallpaper',alias:'主页面壁纸',detail:{
      0:'限时体验',1:'限时体验',2:'限时体验',3:'限时体验',5:'限时体验',10:'限时体验'
    }}
]



