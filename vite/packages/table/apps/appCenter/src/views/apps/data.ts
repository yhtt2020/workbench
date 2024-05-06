export const appsList = [
  {
    icon: "https://s1.hdslb.com/bfs/static/jinkela/popular/assets/icon_popular.png",
    name: "网页数据监控小助手",
    summary:
      "一个用于检测网页数据的工具，可以实时监测一个网页数据动态，并组织成可视化的报表，目前支持B站视频数据追踪。",
    needInstall: false,
    data: {
      fullScreen: false,
      theme: "#030c13",
      name: "watch",
      type: "system", //网页助手
      route: JSON.stringify({
        name: "watch",
      }),
    },
  },
  {
    icon: "https://a.apps.vip/icons/weather.png",
    name: "浏览器",
    summary: "内置于工作台的浏览器，方便在工作台打开网页。",
    needInstall: false,
    data: {
      fullScreen: false,
      theme: "#030c13",
      name: "browser",
      type: "system", //网页助手
      route: JSON.stringify({
        name: "browser",
      }),
    },
  },
  {
    icon: "https://a.apps.vip/icons/weather.png",
    name: "天气",
    summary: "可以自由添加城市。",
    needInstall: false,
    data: {
      fullScreen: false,
      theme: "#030c13",
      name: "weather",
      type: "system", //网页助手
      route: JSON.stringify({
        name: "weather",
      }),
    },
  },
  {
    icon: "/img/game.png",
    name: "游戏小助手",
    summary: "",
    needInstall: false,
    data: {
      fullScreen: false,
      theme: "#030c13",
      name: "gameAssistant",
      type: "system", //网页助手
      route: JSON.stringify({
        name: "gameIndex",
      }),
    },
  },
  {
    icon: "https://a.apps.vip/icons/paper.png",
    name: "壁纸",
    summary: "锁屏壁纸，支持导入本地壁纸，以及多个图源，同时支持动态壁纸。",
    needInstall: false,
    data: {
      fullScreen: false,
      theme: "#030c13",
      name: "gallery",
      type: "system", //网页助手
      route: JSON.stringify({
        name: "my",
      }),
    },
  },
  {
    icon: "https://a.apps.vip/icons/music.png",
    name: "音乐",
    summary: "网络音乐播放器。",
    needInstall: false,
    data: {
      fullScreen: false,
      theme: "#030c13",
      name: "music",
      type: "system", //网页助手
      route: JSON.stringify({
        name: "music",
      }),
    },
  },
  {
    icon: "https://a.apps.vip/icons/tomato.png",
    name: "便签",
    summary: "便签工具",
    needInstall: false,
    data: {
      fullScreen: false,
      theme: "#030c13",
      name: "note",
      type: "system", //网页助手
      route: JSON.stringify({
        name: "note",
      }),
    },
  },
  {
    icon: "https://a.apps.vip/icons/ppet.png",
    name: "PPet桌面宠物",
    summary: "一款开源桌面看板娘，让你不再孤单。",
    needInstall: true,
    installPath: "C:\\Program Files\\PPet3\\PPet3.exe",
    downloadUrl: "https://a.apps.vip/download/ppet3330.exe",
    data: {
      security: true,
    },
  },
  {
    icon: "https://a.apps.vip/icons/debugtron.svg",
    name: "Debugtron",
    summary: "基于Electron的调试工具，用于发现问题。",
    needInstall: true,
    installPath: "%LOCALAPPDATA%\\debugtron\\Debugtron.exe",
    downloadUrl: "https://a.apps.vip/download/debugtron.exe",
    data: {
      security: true,
    },
  },
  {
    icon: "https://a.apps.vip/download/aida64.jpg",
    name: "AIDA64",
    summary: "一款商业级计算机硬件状态监控软件。",
    needInstall: true,
    silent: false, //静默安装
    installPath:
      "C:\\Program Files (x86)\\FinalWire\\AIDA64 Extreme\\aida64.exe",
    downloadUrl: "https://a.apps.vip/download/aida64extreme685.exe",
    data: {
      security: true,
    },
  },
  {
    icon: "https://a.apps.vip/download/rtss.png",
    name: "RTSS",
    summary: "一款免费的游戏帧数监测软件。",
    needInstall: true,
    installPath:
      "C:\\Program Files (x86)\\RivaTuner Statistics Server\\RTSS.exe",
    downloadUrl: "https://a.apps.vip/download/rtss.exe",
    data: {
      security: true,
    },
  },
  {
    icon: "https://a.apps.vip/download/dsf.svg",
    name: "DisplayFusion",
    summary: "解决游戏触摸最小化问题。一款用来提升副屏体验的商业软件。",
    needInstall: true,
    silent: false, //非静默安装
    installPath: "C:\\Program Files\\DisplayFusion\\DisplayFusion.exe",
    downloadUrl: "https://a.apps.vip/download/DisplayFusionSetup-10.0.exe",
    data: {
      security: true,
    },
  },
  {
    icon: "https://a.apps.vip/wallpaper/favicon.png",
    name: "OneWallheaven壁纸",
    summary:
      "开源壁纸轻应用，可以将wallheaven上的壁纸设置为桌面壁纸或者工作台壁纸。",
    needInstall: false,
    data: {
      theme: "#030c13",
      name: "wallpapaer",
      url: "https://a.apps.vip/wallpaper",
      preload: "wallpaper",
      background: true,
      node: true,
      security: false,
    },
  },
  {
    icon: "https://a.apps.vip/icons/kook.png",
    name: "Kook",
    summary: "在副屏上使用Kook，一个好用的开黑组团语音沟通工具",
    needInstall: false,
    data: {
      theme: "rgb(23,24,26)",
      name: "kook",
      url: "https://www.kookapp.cn/app/discover",
      background: true,
      node: false,
      security: true,
      fullScreen: false,
    },
  },
  {
    icon: "https://res.wx.qq.com/a/wx_fed/assets/res/OTE0YTAw.png",
    name: "微信",
    summary: "在副屏上使用网页版微信聊天。（已适配小屏）",
    needInstall: false,
    data: {
      theme: "#2e3238",
      name: "weixin",
      url: "https://wx.qq.com",
      preload: "weixin",
      background: true,
      node: false,
      security: true,
    },
  },
  {
    icon: "https://p1-hera.byteimg.com/tos-cn-i-jbbdkfciu3/22718e94fbd9483ea54301cf431ce2ee~tplv-jbbdkfciu3-image:0:0.image",
    name: "飞书",
    summary: "在副屏上使用飞书办公。（可用）",
    needInstall: false,
    data: {
      theme: "#465069",
      name: "feishu",
      url: " https://feishu.cn/messenger/",
      preload: "app",
      background: true,
      node: false,
      security: true,
    },
  },
  {
    icon: "https://a.apps.vip/todo/logo.png",
    name: "轻待办",
    summary: "快速创建和管理你的待办。",
    needInstall: false,
    data: {
      fullScreen: false,
      theme: "transparent",
      name: "todo",
      url: "https://a.apps.vip/todo",
      preload: "app",
      background: true,
      node: true,
      security: true,
    },
  },
];
