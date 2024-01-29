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
        intro:
          "你可以按照需要自由添加自己喜欢的小组件，来搭配自己的桌面，同时绝大多数小组件都支持同时添加多个，以实现不同的功能和用途。",
        description:
          "在桌面空白处右键，在出现的菜单中选择「添加小组件」，即可在创意市场中挑选你想要的小组件。",

        open: [
          {
            type: "router",
            value: "home",
          },
          {
            type: "bus",
            value: "M0101",
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
        intro:
          "个性化定制，让你的桌面更加独特！通过使用“添加一个图标”功能，你可以每天轻松添加自定义的图标，让你的桌面更加个性化和独特。无论是添加你最喜爱的应用程序还是创建自己的快捷方式，这个功能都能帮助你快速实现。",
        description:
          "在桌面空白处右键，在出现的菜单中选择「添加图标」，可以选择各种类型的图标，也可以选择你的桌面图标进行添加",

        open: [
          {
            type: "router",
            value: "home",
          },
          {
            type: "bus",
            value: "M0102",
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
        intro:
          "整理桌面从未如此简单！告别杂乱的桌面图标，让一键创建图标分组来帮助你自动整理。不再需要费时费力地手动调整图标位置，只需轻轻一点，即可创建个性化的图标分组，让你的桌面整洁有序。",

        description:
          "在桌面空白处右键，在出现的菜单中选择「添加图标分组」，即可在桌面上创建一个空白分组，你可以拖动图标到分组中，或点击添加图标进行选择添加。",

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
        intro:
          "喜欢的小组件太多？一个桌面放不下，没关系我们还支持创建多个桌面，每个桌面都有自己独立的设置，可以添加不同的小组件。",
        description:
          "在桌面空白处右键，在出现的菜单中选择「添加桌面」，在出现的弹窗中选择空桌面进行添加。",

        open: [
          {
            type: "router",
            value: "home",
          },
          {
            type: "bus",
            value: "M0104",
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
        intro:
          "工作台提供了强大的底部和侧边导航栏，你可以按照需要自定义修改需要放置的应用或图标。",
        description:
          "在导航栏上右键，在出现的菜单中选择「添加图标」，即可选择各个类型图标；你也可以将工作台桌面的小组件和图标拖动到导航栏，还支持你的windows桌面或资源管理器的文件夹、应用程序快捷方式。",

        open: [
          {
            type: "router",
            value: "home",
          },
          {
            type: "bus",
            value: "M0105",
          },
        ],
      },
    ],
  },
  {
    chapter: "第二章",
    info: "了解关于如果导入你的系统文件或应用图标到桌面，如何添加图标以及如何对图标进行分组。",
    tasks: [
      {
        id: "M0201",
        name: "更换桌面壁纸",
        pre: "M0105",
        suf: "M0202",
        repeatable: true,
        frequency: 1,
        intro:
          "工作台背景太单调？我们提供了自定义壁纸功能，支持选择内置的开源壁纸，或者你可以手动上传自己喜欢的壁纸。",
        description:
          "在桌面空白处右键，在出现的菜单中选择「更换壁纸」，即可选择为你精心挑选的开源壁纸，你也可以自定义上传。",

        open: [
          {
            type: "router",
            value: "home",
          },
          {
            type: "bus",
            value: "M0201",
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
        description:
          "在工作台设置（你可以从导航栏图标或导航栏右键菜单中找到设置入口）中，选择「主题」，即可在出现的弹窗中选择你喜欢的主题配色。",

        open: [
          {
            type: "router",
            value: "setting",
          },
          {
            type: "bus",
            value: "M0202",
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
        intro:
          "搭建不出自己满意的桌面？没关系，创意市场提供了大量社区用户分享的桌面方案，快来挑选吧。",
        description:
          "在桌面空白处右键，选择「添加桌面」，即可选择来自创意市场的用户分享的方案。",

        open: [
          {
            type: "router",
            value: "home",
          },
          {
            type: "bus",
            value: "M0203",
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
        description: "在弹幕设置界面开启弹幕",

        open: [
          {
            type: "router",
            value: "barrage",
          },

        ],
      },
    ],
  },
  {
    chapter: "第三章",
    info: "了解如何进一步个性化你的工作台，使用一个来自社区分享的桌面和小组件。",
    tasks: [
      {
        id: "M0301",
        name: "修改一次个人信息",
        pre: "M0204",
        suf: "M0302",
        repeatable: true,
        frequency: 1,
        intro: "设置一个你喜欢的头像和昵称，同步展示到工作台和元社区。",
        description:
          "在底部导航或工作台设置中心，点击头像即可进入用户中心选择修改资料。",

        open: [
          {
            type: "router",
            value: "socialMy",
          },
          {
            type: "bus",
            value: "M0301",
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
        description:
          "在桌面空白处右键，在出现的菜单中选择「添加小组件」，即可在创意市场的社区分类下选择元社区小组件进行添加。",
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
          {
            type: "bus",
            value: "M0302",
          },
        ],
      },
    ],
  },
];
