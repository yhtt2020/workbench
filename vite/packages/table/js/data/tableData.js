let vm = null;
const sendThis = ( _this )=> {
  vm = _this;
};
export default {
  sendThis,
  navigationClassify :[
    {name:'systemApp',cname:'我的应用'},
    {name:'coolApp',cname:'酷应用'},
    {name:'tableApp',cname:'Windows应用'},
    {name:'localApp',cname:'自定义应用'},
    {name:'lightApp',cname:'轻应用'},
  ],
  coolAppList:[
    {
      icon: 'http://a.apps.vip/icons/flappy.jpg',
      type:'coolApp',
      name: 'Mlappy Bird',
      summary: '和小伙伴们一起飞。',
      needInstall: false,
      data: {
        theme: '#030c13',
        name: 'mlappyBird',
        url: 'http://bird.apps.vip/?',
        background: false,
        type:'game',
        scale:160
      }
    },
    {
      icon: 'https://s1.hdslb.com/bfs/static/jinkela/popular/assets/icon_popular.png',
      name: '网页数据监控小助手',
      type:'coolApp',
      summary: '一个用于检测网页数据的工具，可以实时监测一个网页数据动态，并组织成可视化的报表，目前支持B站视频数据追踪。',
      needInstall: false,
      data: {
        fullScreen: false,
        theme: '#030c13',
        name: 'watch',
        type: 'system',//网页助手
        route: JSON.stringify({
          name: 'watch',
        })
      }
    },
    {
      icon: 'https://a.apps.vip/icons/ppet.png',
      name: 'PPet桌面宠物',
      type:'coolApp',
      summary: '一款开源桌面看板娘，让你不再孤单。',
      needInstall: true,
      data: {
        security: true
      }
    },
    {
      icon: 'https://a.apps.vip/wallpaper/favicon.png',
      name: 'OneWallheaven壁纸',
      type:'coolApp',
      summary: '开源壁纸轻应用，可以将wallheaven上的壁纸设置为桌面壁纸或者工作台壁纸。',
      needInstall: false,
      data: {
        theme: '#030c13',
        name: 'wallpapaer',
        url: 'https://a.apps.vip/wallpaper',
        preload: 'wallpaper',
        background: true,
        node: true,
        security: false
      }
    }, {
      icon: 'https://a.apps.vip/icons/kook.png',
      name: 'Kook',
      type:'coolApp',
      summary: '在副屏上使用Kook，一个好用的开黑组团语音沟通工具',
      needInstall: false,
      data: {
        theme: 'rgb(23,24,26)',
        name: 'kook',
        url: 'https://www.kookapp.cn/app/discover',
        background: true,
        node: false,
        security: true,
        fullScreen:false,
      }
    },
    {
      icon: 'https://res.wx.qq.com/a/wx_fed/assets/res/OTE0YTAw.png',
      name: '微信',
      type:'coolApp',
      summary: '在副屏上使用网页版微信聊天。（已适配小屏）',
      needInstall: false,
      data: {
        theme: '#2e3238',
        name: 'weixin',
        url: 'https://wx.qq.com',
        preload: 'weixin',
        background: true,
        node: false,
        security: true
      }
    },
    {
      icon: 'https://p1-hera.byteimg.com/tos-cn-i-jbbdkfciu3/22718e94fbd9483ea54301cf431ce2ee~tplv-jbbdkfciu3-image:0:0.image',
      name: '飞书',
      type:'coolApp',
      summary: '在副屏上使用飞书办公。（可用）',
      needInstall: false,
      data: {
        theme: '#465069',
        name: 'feishu',
        url: ' https://feishu.cn/messenger/',
        preload: 'app',
        background: true,
        node: false,
        security: true
      }
    },
    {
      icon: 'https://a.apps.vip/todo/logo.png',
      name: '轻待办',
      type:'coolApp',
      summary: '快速创建和管理你的待办。',
      needInstall: false,
      data: {
        fullScreen: false,
        theme: 'transparent',
        name: 'todo',
        url: 'https://a.apps.vip/todo',
        preload: 'app',
        background: true,
        node: true,
        security: true
      }
    }
  ],
  systemAppList: [
    {
      type:'systemApp',
      icon:'home',
      name:'主页',
      event:'home',
    },
    {
      "type": "systemApp",
      "icon": "youxishoubing",
      "name": "游戏",
      "event": "agme"
    },{
        "type": "systemApp",
        "icon": "yinle1",
        "name": "音乐",
        "event": "apps"
    },
    {
      type:'systemApp',
      icon:'lock',
      name:'锁定屏幕',
      event:'lock',
      fn(){
        vm.$router.push({ path: '/lock' })}
    },{
      type:'systemApp',
      icon:'desktop',
      name:'设备设置',
      event:'status',
      fn:()=>{
        if (vm.$route.path === '/status') {
          vm.$router.go(-1)
        } else {
          vm.$router.push({ path: '/status' })
        }
      }
    },
    {
      type:'systemApp',
      icon:'fullscreen',
      name:'全屏显示',
      event:'fullscreen',
      fn:()=>{
        if (vm.full) {
          vm.$emit('setFull',false)
          tsbApi.window.setFullScreen(false)
        } else {
          vm.$emit('setFull',true)
          tsbApi.window.setFullScreen(true)
        }
      }
    },
    {
      type:'systemApp',
      icon:'setting',
      name:'基础设置',
      event:'setting',
      fn:()=>{  vm.$router.push({ name: 'setting' })}
    },{
      type:'systemApp',
      icon:'tuichu',
      name:'电源',
      event:'power',
      fn:()=>{vm.$router.push({ path: '/power' })}
    },
     {
      type:'systemApp',
      icon:'thunderbolt',
      name:'快捷指令',
      event:'deck',
    },{
      type:'systemApp',
      icon:'shangchuan',
      name:'文件传输',
      event:'fileHelper',
      data:{
          theme: '#2c2c2c',
          name: 'fileHelper',
          url: 'https://szfilehelper.weixin.qq.com/',
          preload: 'fileHelper',
          background: false,
      }
    },
    {
      type:'systemApp',
      icon:'yingyongzhongxin',
      name:'应用管理',
      event:'apps',
    },
    {
      type:'systemApp',
      icon:'daibanshixiang',
      name:'待办',
      event:'home',
      data:
        {
          fullScreen: false,
          theme: 'transparent',
          name: 'todo',
          url: 'https://a.apps.vip/todo',
          background: true,
          node: true,
          security: true
        }
    },
  ]
}

