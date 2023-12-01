// 步骤一选择工作台模式数据
export const guideData = [
  {
    title: '默认桌面', 
    url: ['fluent-emoji:desktop-computer'], 
    id: 'de',
    explain: '为你添加游戏娱乐相关的桌面组件和设置。'
  },
  {
    title: '游戏娱乐', 
    url: ['fluent-emoji:joystick'], 
    id: 'gr',
    explain: '为你添加游戏娱乐相关的桌面组件和设置。'
  },
  {
    title: '效率办公', 
    url: ['fluent-emoji:card-index'], 
    id: 'wf',
    explain: '为你添加效率办公相关的桌面组件和设置。'
  },
  {
    title: '游戏+效率', 
    url: ['fluent-emoji:card-index', 'fluent-emoji:joystick'], 
    id: 'dy',
    explain: '同时添加效率办公、游戏娱乐相关功能。'
  },

]

// 步骤二选择工作台主题模式数据
export const workTheme = [
  { title: '暗色模式', url: 'new_moon_3d', id: 0 },
  { title: '浅色模式', url: 'sun_3d', id: 1 }
]

// 步骤三工作台极简模式和完整模式数据
export const modeData = [
  { title: '完整模式', name: 'intMode', },
  { title: '极简模式', name: 'simpMode' },

]

// 模式图
export const modeImg = {
  initUrl:'https://a.apps.vip/icons/mod/common.png',
  simpleUrl:'https://a.apps.vip/icons/mod/tiny.png'
}

export const teamData = [
  {
    img: 'init', title: '小队',
    content: '与全网的工作台小伙伴自由组成小队，一同体验“等级加速”、“道具互动”等等那些旧时的回忆和乐趣，为你带来一种不一样的陪伴感。'
  },
  {
    img: 'placard_3d', title: '底部个人信息栏',
    content: '内置即时通讯、弹幕应用，同步产品社区，也可以创建你的专属社群。'
  }
]

// 游戏娱乐左侧和底部栏数据
export const gamePanel = {
  left: [
    { 'type': 'systemApp', 'icon': 'shouye1', 'name': '主页', 'event': 'home' },
    { 'type': 'systemApp', 'icon': 'yingyongzhongxin', 'name': '应用管理', 'event': 'apps' },
    { 'type': 'systemApp', 'icon': 'youxishoubing', 'name': '游戏', 'event': 'gameIndex' },
    { 'type': 'systemApp', 'icon': 'yinle1', 'name': '音乐', 'event': 'music' },
    { 'type': 'systemApp', 'icon': 'banner', 'name': '壁纸', 'event': 'my', }
  ],
  bottom: [
    { 'type': 'systemApp', 'icon': 'lock', 'name': '锁定屏幕', 'event': 'lock' },
    { 'type': 'systemApp', 'icon': 'laptop', 'name': '设备设置', 'event': 'status' },
    { 'type': 'systemApp', 'icon': 'fullscreen', 'name': '全屏显示', 'event': 'fullscreen' },
    { 'type': 'systemApp', 'icon': 'setting', 'name': '基础设置', 'event': 'setting' },
    { 'type': 'systemApp', 'icon': 'tuichu', 'name': '电源', 'event': 'power' }
  ]
}
// 效率辅助左侧和底部栏数据
export const workPanel = {
  left: [
    { 'type': 'systemApp', 'icon': 'shouye1', 'name': '主页', 'event': 'home' },
    { 'type': 'systemApp', 'icon': 'yingyongzhongxin', 'name': '应用管理', 'event': 'apps' },
    {
      type: 'systemApp',
      icon: 'rizhi',
      name: '办公',
      tab:'work',
      event: 'work',
    },
  ],
  bottom: [
    {
      type: 'systemApp', icon: 'shangchuan', name: '文件传输', event: 'fileHelper',
      data: {
        theme: '#2c2c2c', name: 'fileHelper', url: 'https://szfilehelper.weixin.qq.com/',
        preload: 'fileHelper', background: false,
      }
    },
    {
      icon: 'https://res.wx.qq.com/a/wx_fed/assets/res/OTE0YTAw.png',
      name: '微信',
      type: 'coolApp',
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
    { 'type': 'systemApp', 'icon': 'lock', 'name': '锁定屏幕', 'event': 'lock' },
    { 'type': 'systemApp', 'icon': 'laptop', 'name': '设备设置', 'event': 'status' },
    { 'type': 'systemApp', 'icon': 'fullscreen', 'name': '全屏显示', 'event': 'fullscreen' },
    { 'type': 'systemApp', 'icon': 'setting', 'name': '基础设置', 'event': 'setting' },
    { 'type': 'systemApp', 'icon': 'tuichu', 'name': '电源', 'event': 'power' }
  ]
}
// 极简diy左侧和底部栏数据
export const diyPanel = {
  left: [
    { 'type': 'systemApp', 'icon': 'shouye1', 'name': '主页', 'event': 'home' },
    { 'type': 'systemApp', 'icon': 'yingyongzhongxin', 'name': '应用管理', 'event': 'apps' },
    { 'type': 'systemApp', 'icon': 'yinle1', 'name': '音乐', 'event': 'music' },
    { 'type': 'systemApp', 'icon': 'kuaijie1', 'name': '快捷指令', 'event': 'deck' },
  ],
  bottom: [
    { 'type': 'systemApp', 'icon': 'lock', 'name': '锁定屏幕', 'event': 'lock' },
    { 'type': 'systemApp', 'icon': 'setting', 'name': '基础设置', 'event': 'setting' },
    { 'type': 'systemApp', 'icon': 'fullscreen', 'name': '全屏显示', 'event': 'fullscreen' },
    { 'type': 'systemApp', 'icon': 'laptop', 'name': '设备设置', 'event': 'status' },
    { 'type': 'systemApp', 'icon': 'tuichu', 'name': '电源', 'event': 'power' }
  ]
}

// 游戏娱乐和效率辅助合并左侧和底部栏数据
export const mergePanel = {
  left: [
    { 'type': 'systemApp', 'icon': 'shouye1', 'name': '主页', 'event': 'home' },
    { 'type': 'systemApp', 'icon': 'yingyongzhongxin', 'name': '应用管理', 'event': 'apps' },
    {
      type: 'systemApp',
      icon: 'rizhi',
      name: '办公',
      tab:'work',
      event: 'work',
    },
    { 'type': 'systemApp', 'icon': 'youxishoubing', 'name': '游戏', 'event': 'gameIndex' },
    { 'type': 'systemApp', 'icon': 'yinle1', 'name': '音乐', 'event': 'music' },
    { 'type': 'systemApp', 'icon': 'banner', 'name': '壁纸', 'event': 'my', },
  ],
  bottom: [
    {
      type: 'systemApp', icon: 'shangchuan', name: '文件传输', event: 'fileHelper',
      data: {
        theme: '#2c2c2c', name: 'fileHelper', url: 'https://szfilehelper.weixin.qq.com/',
        preload: 'fileHelper', background: false,
      }
    },
    {
      icon: 'https://res.wx.qq.com/a/wx_fed/assets/res/OTE0YTAw.png',
      name: '微信',
      type: 'coolApp',
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
    { 'type': 'systemApp', 'icon': 'lock', 'name': '锁定屏幕', 'event': 'lock' },
    { 'type': 'systemApp', 'icon': 'laptop', 'name': '设备设置', 'event': 'status' },
    { 'type': 'systemApp', 'icon': 'fullscreen', 'name': '全屏显示', 'event': 'fullscreen' },
    { 'type': 'systemApp', 'icon': 'setting', 'name': '基础设置', 'event': 'setting' },
    { 'type': 'systemApp', 'icon': 'tuichu', 'name': '电源', 'event': 'power' }
  ],
}

// 工作台桌面
export const deskTemplate = {
  game: [
    {
      name: 'GamesDiscount',
      id: 1683361279519,
      data: {
        id: 'cn',
      },
      _$muuri_id: 'afe08db5-591c-4c03-8535-302485228da7',
    },
    {
      name: 'GameEpic',
      id: 1683361479503,
      data: {},
      _$muuri_id: 'd9775365-ac7a-44eb-9643-f5afd2ce1927',
    },
    {
      name: 'CPULineChart',
      id: 1683361318879,
      data: {},
      _$muuri_id: 'cddb3c87-1dd9-429c-8db5-b626a41b520e',
    },
    {
      name: 'capture',
      id: 1683361487658,
      data: {},
      _$muuri_id: '4f68f51f-12c3-4dfd-a56f-a317eefb2a8d',
    },
    {
      name: 'MyGameSmall',
      id: 1683361327075,
      data: {},
      _$muuri_id: '27f6b805-9460-4b4f-b48a-0fe9f861d4fb',
    },
  ],
  work: [
    {
      name: 'customTimer',
      id: 1683361408159,
      data: {},
      _$muuri_id: 'b9da8e82-b907-45b8-b4f7-404409a53625',
    },
    {
      name: 'clock',
      id: 1683361412293,
      data: {},
      _$muuri_id: '43c55d51-7ffb-4fbd-994c-64a4b8a503d0',
    },
    {
      name: 'weather',
      id: 1683361418237,
      data: {},
      _$muuri_id: 'd6e03889-a8ea-4328-97b4-599350aa4002',
    },
    {
      name: 'timer',
      id: 1683361422401,
      data: {},
      _$muuri_id: '75ed0b65-5b37-4f79-82e5-3b1c46b9df53',
    },
    {
      name: 'smallCountdownDay',
      id: 1683361434496,
      data: {},
      _$muuri_id: '698a7d80-23c9-42cf-9e7b-3a580acc7be8',
    },
    {
      name: 'smallWallpaper',
      id: 1683361445577,
      data: {
        Code: {
          id: 1683361445577,
          value: {
            value: '贪食鬼',
            path: 'https://api.nguaduot.cn/glutton/journal',
            name: 'PickingPaper',
          },
        },
      },
      _$muuri_id: 'd6f9dfae-8098-4da3-8f15-3913cb506bf7',
    },
  ],
  empty: [],
  gameName: '游戏娱乐',
  workName: '效率辅助',
  emptyName: 'DIY桌面',
}
