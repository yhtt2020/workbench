export const tasks = [
  {
    tasks: [
      {
        id: "firstTask",
      },
    ],
  },
  {
    chapter: "第一章",
    info: "了解关于桌面和导航栏的基础使用方式。",
    tasks: [
      {
        id: "M0101",
        name: "添加一个小组件",
        pre: "/",
        suf: "M0102",
        repeatable: true,
        frequency: 1,
        intro:"你可自由添加小组件到桌面，多数支持同时添加多个，满足不同功能和用途",
        description: "在桌面空白处右键，在出现的菜单中选择「添加小组件」，即可在创意市场中挑选你想要的小组件。",
        open: [
          {
            type: "router",
            value: "home",
          },
        ],
      },
      {
        id: "M0102",
        name: "添加一个图标",
        pre: "M0101",
        suf: "M0103",
        repeatable: true,
        frequency: 1,
        intro:"无论是添加最喜欢的应用还是创建快捷方式，让你的桌面更独特",
        description:"在桌面右键菜单中选择「添加图标」，可以选择各种类型的图标。",

        open: [
          {
            type: "router",
            value: "home",
          },
        ],
      },
      {
        id: "M0103",
        name: "添加一个图标分组",
        pre: "M0102",
        suf: "M0104",
        repeatable: true,
        frequency: 1,
        intro:"一键创建图标分组，轻松整理桌面，告别杂乱。",
        description:"在桌面右键菜单中选择「添加图标分组」创建空白分组，你可以拖动图标到分组中，或点击添加图标进行选择添加。",

        open: [
          {
            type: "router",
            value: "home",
          },
        ],
      },
      {
        id: "M0104",
        name: "添加一个桌面",
        pre: "M0103",
        suf: "M0105",
        repeatable: true,
        frequency: 1,
        intro:"小组件太多？别担心，我们支持创建多个桌面，每个都可独立设置和添加不同的小组件。",
        description:"在桌面右键菜单中选择「添加桌面」，在出现的弹窗中选择创建空白桌面或使用社区分享的模版。",

        open: [
          {
            type: "router",
            value: "home",
          },
        ],
      },
      {
        id: "M0105",
        name: "添加一个导航图标",
        pre: "M0104",
        suf: "M0201",
        repeatable: true,
        frequency: 1,
        intro:"工作台有强大的底部和侧边导航栏，可自由定制应用和图标的放置。",
        description:"在导航栏右键菜单中选择「添加图标」，即可选择各个类型图标；你也可以将外部链接、图标拖动到导航上。",
        open: [
          {
            type: "router",
            value: "home",
          },
        ],
        showOne:{
          name:'推荐进行下一章节任务~'
        },
      },
    ],
  },
  {
    chapter: "第二章",
    info: "了解如何进一步个性化设置你的桌面风格。",
    tasks: [
      {
        id: "M0201",
        name: "更换桌面壁纸",
        pre: "M0105",
        suf: "M0202",
        repeatable: true,
        frequency: 1,
        intro:"工作台背景单调？可选择内置开源壁纸或上传自己喜欢的壁纸，自定义你的背景。",
        description:"在桌面空白处右键，在出现的菜单中选择「更换壁纸」，即可选择为你精心挑选的开源壁纸，你也可以自定义上传。",

        open: [
          {
            type: "router",
            value: "home",
          },
        ],
      },
      {
        id: "M0202",
        name: "自定义工作台主题颜色",
        pre: "M0201",
        suf: "M0203",
        repeatable: true,
        frequency: 1,
        intro: "你可以自由修改工作台的主题颜色和文字颜色，来搭配你的桌面壁纸。",
        description:"在工作台设置（你可以从导航栏图标或导航栏右键菜单中找到设置入口）中，选择「主题」，即可在出现的弹窗中选择你喜欢的主题配色。",

        open: [
          {
            type: "router",
            value: "home",
          },
        ],
      },
      {
        id: "M0203",
        name: "使用一个社区分享的桌面",
        pre: "M0202",
        suf: "M0204",
        repeatable: true,
        frequency: 1,
        intro:"无法搭建理想的桌面？创意市场有社区用户分享的丰富桌面方案，快来找找吧！",
        description:"在桌面空白处右键，选择「添加桌面」，即可选择来自创意市场的用户分享的方案。",
        open: [
          {
            type: "router",
            value: "home",
          },
        ],
      },
      {
        id: "M0204",
        name: "开启弹幕功能",
        pre: "M0203",
        suf: "M0301",
        repeatable: true,
        frequency: 1,
        intro: "是时候和其他人见面了，开启弹幕功能吧！",
        description: "在设置中心或社群应用的弹幕设置界面开启弹幕。",
        open: [
          {
            type: "router",
            value: "home",
          },
        ],
      },
    ],
  },
  {
    chapter: "第三章",
    info: "了解更多功能。",
    tasks: [
      {
        id: "M0301",
        name: "修改一次个人信息",
        pre: "M0204",
        suf: "M0302",
        repeatable: true,
        frequency: 1,
        intro: "设置一个你喜欢的头像和昵称，同步展示到工作台和元社区。",
        description:"在底部导航或工作台设置中心，点击头像即可进入用户中心选择修改资料。",

        open: [
          {
            type: "router",
            value: "home",
          },
        ],
      },
      {
        id: "M0302",
        name: "添加一个元社区小组件",
        pre: "M0301",
        suf: "",
        guide: true,
        repeatable: "是",
        frequency: "一次",
        intro: "时刻关注工作台的更新动态，第一时间体验新功能。",
        description:"在桌面空白处右键，在出现的菜单中选择「添加小组件」，即可在创意市场的社区分类下选择元社区小组件进行添加。",
        reward: [
          {
            type: "communityPoints",
            value: 30,
          },
          {
            type: "medal",
          },
        ],
        open: [
          {
            type: "router",
            value: "home",
          },
        ],
        showPrimary:{
          name:'支线任务已解锁~'
        }
      },
    ],
  },
];
