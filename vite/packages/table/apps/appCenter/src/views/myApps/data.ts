export const dropList = [
  {
    id: "0",
    name: '全部应用',
    value: 'all'
  },
  {
    id: "1",
    name: '酷应用',
    value: 'coolApp'
  },
  {
    id: "2",
    name: '本地应用',
    value: 'localApp'
  },
  {
    id: "3",
    name: '开发者应用',
    value: 'ttapp'
  },
  {
    id: "4",
    name: '轻应用',
    value: 'lightApp'
  },
  {
    id: "5",
    name: '系统应用',
    value: 'systemApp'
  }
]

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
]
