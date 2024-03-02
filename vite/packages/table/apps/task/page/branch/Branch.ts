export const tasks = {
  games: [
    {
      name: "游戏",
      info: "了解关于游戏辅助类功能的使用方式。",
      tasks: [
        {
          id: "Z0101",
          name: "绑定Steam账号",
          info: "游戏助手可以支持绑定Steam账号，读取游戏库数据，在工作台中快速启动你的游戏，还支持个性化游戏桌面搭建和攻略查询。",
          pre: "",
          open: [
            {
              type: "router",
              value: "gameSetting",
            },
          ],
          index:0,
        },
        {
          pre: "",
          id: "Z0102",
          name: "从游戏助手中启动一个Steam游戏",
          info: "你已经完成了Steam账号绑定，可以看到你的游戏库数据，点击某个游戏在弹出的面板中即可选择启动游戏。",
          open: [
            {
              type: "router",
              value: "myGame",
            },
          ],
          index:1,
        },
        // {
        //   id: "Z0103",
        //   name: "添加一个游戏桌面",
        //   info: "你可以基于某个游戏来为其搭建一个桌面，分配不同的小组件。",
        //   open: [
        //     {
        //       type: "router",
        //       value: "gameSetting",
        //     },
        //   ],
        // },
        {
          pre: "",
          id: "Z0104",
          name: "使用捕获功能创建一个游戏截图",
          info: "精彩时刻不容错过，使用游戏助手的捕获功能轻松截取游戏时刻，同时支持自定义设置截图保存位置。",
          open: [
            {
              type: "router",
              value: "GameCapture",
            },
          ],
          index:2,
        },
        {
          pre: "",
          id: "Z0105",
          name: "使用捕获助手创建一个游戏录屏",
          info: "精彩时刻不容错过，使用游戏助手的捕获功能轻松截取游戏时刻，同时支持自定义设置录频保存位置。",
          open: [
            {
              type: "router",
              value: "GameCapture"
            },
          ],
          index:3,
        },
        {
          pre: "",
          id: "Z0106",
          name: "在桌面上添加一个性能监控小组件，并成功获取一次系统性能数据",
          info: "想要实时关注游戏的性能指标，在桌面上添加性能监控小组件，搭配主流的AIDA64和RTSS软件，来实现完整的系统性能监控。",
          open: [
            {
              type: "router",
              value: "home",
            },
            {
              type: "bus",
              value: "Z0106",
            },
          ],
          index:4,
        },
      ],
    },
  ],
  efficiency: [
    {
      name: "效率",
      info: "了解关于效率办公类功能的使用方式。",
      tasks: [
        /**当前完成桌面定制流程任务放在活动任务中**/ 
        {
          pre: "",
          id: "Z0201",
          name: "完成桌面定制流程",
          info: "简单几步，轻松整理你的桌面，为你添加合适的组件和图标。",
          open: [
            {
             type:'bus',
             value: "customDesk",
            },
          ],
          index:0,
        },
        {
          pre: "",
          id: "Z0202",
          name: "添加或使用一个快捷指令",
          info: "你可以自定义创建系统快捷指令，支持CMD命令行，自定义快捷键等等。",
          open: [
            {
              type: "router",
              value: "deck",
            },
          ],
          index:0,
        },
        {
          pre: "",
          id: "Z0203",
          name: "添加或使用一个应用快捷键方案",
          info: "常用软件快捷键记不住？在工作台创建软件快捷键方案，使用指定软件时轻松打开。",
          open: [
            {
              type: "router",
              value: "schemeIndex",
            },
          ],
          index:1,
        },
        {
          pre: "",
          id: "Z0204",
          name: "创建一个待办",
          info: "工作台内置简洁的待办事项小组件，可快速创建任务。",
          open: [
            {
              type: "router",
              value: "todo",
            },
          ],
          index:2,
        },
        {
          pre: "",
          id: "Z0205",
          name: "写一篇备忘录并添加到桌面",
          info: "用备忘录记录重要时刻，轻松记录想法、待办事项和提醒，提高生活效率。",
          open: [
            {
              type: "router",
              value: "note",
            },
          ],
          index:3,
        },
        {
          pre: "",
          id: "Z0206",
          name: "开启剪贴板应用并复制一条历史数据",
          info: "剪贴板应用轻松复制历史数据，无论文本、链接还是图片。随时访问，方便快捷。",
          open: [
            {
              type: "router",
              value: "clipboard",
            },
          ],
          index:4,
        },
        {
          pre: "",
          id: "Z0207",
          name: "向AI助手发起一个问题",
          info: "AI助手帮你迅速解答疑问，提供信息和建议。有免费额度，也支持使用自己的API。",
          open: [
            {
              type: "router",
              value: "ai",
            },
          ],
          index:5,
        },
        {
          pre: "",
          id: "Z0208",
          name: "完成一次番茄时间",
          info: "提高效率，用“番茄时间”安排工作和休息，集中注意力。",
          open: [
            {
              type: "router",
              value: "home",
            },
          ],
          index:6,
        },
        {
          pre: "",
          id: "Z0209",
          name: "分享一个桌面",
          info: "搭配除了不错的桌面方案，快来分享给社区其他用户吧。",
          open: [
            {
              type: "router",
              value: "home",
            },
          ],
          index:7,
        },
      ],
    },
  ],
  association: [
    {
      name: "小队",
      info: "什么是小队？帮助你了解如何玩转小队功能。",
      tasks: [
        {
          pre: "",
          id: "Z0401",
          name: "加入或者创建一个小队",
          info: "小队功能助力团队合作，提高效率。每天使用，共同取得奖励成就。",
          open: [
            {
              type: "router",
              value: "home",
            },
            {
              type: "bus",
              value: "Z0401",
            },
          ],
          index:0,
        },
        {
          pre: "",
          id: "Z0402",
          name: "领取一次小队加速时长",
          info: "等级加速太慢了，让小队帮你提提速",
          open: [
            {
              type: "router",
              value: "home",
            },
            {
              type: "bus",
              value: "Z0402",
            },
          ],
          index:1,
        },
      ],
    },
    {
      name: "弹幕",
      info: "什么！？桌面上也能发弹幕？",
      tasks: [
        {
          pre: "",
          id: "Z0501",
          name: "发布一条全网弹幕",
          info: "与全网的小伙伴互动一下吧",
          open: [
            {
              type: "router",
              value: "barrage",
            },
          ],
          index:0,
        },
        {
          pre: "",
          id: "Z0502",
          name: "发布一条小队弹幕",
          info: "与你的小队成员互动一下吧",
          open: [
            {
              type: "router",
              value: "barrage",
            },
            {
              type: "bus",
              value: "Z0502",
            },
          ],
          index:1,
        },
      ],
    },
    {
      name: "社群",
      info: "探索社交世界，加入一个社群，分享你的热爱！",
      tasks: [
        {
          pre: "",
          id: "Z0601",
          name: "创建/加入一个群聊",
          info: "内置即时聊天功能，和你的小伙伴畅快沟通吧。",
          //
          open: [
            {
              type: "router",
              value: "chat",
            },
          ],
          index:0,
        },
        {
          pre: "",
          id: "Z0602",
          name: "添加一个好友",
          info: "快来扩充一下你的好友列表。",
          open: [
            {
              type: "router",
              value: "chat",
            },
          ],
          index:1,
        },
        // {
        //   pre: "",
        //   id: "Z0603",
        //   name: "加入一个社群", wjl说有bug已屏蔽
        //   info: "探索社交世界，加入一个社群！你可以每天轻松搜索和发现各种社群，并加入你感兴趣的社群。无论是学习新技能、分享经验还是结交新朋友，社群都是一个非常好的平台。",
        // },
        {
          pre: "",
          id: "Z0604",
          name: "创建一个社群并添加一个社群频道",
          info: "探索社交世界，加入你感兴趣的社群，结交新朋友，分享经验。",
          open: [
            {
              type: "router",
              value: "chat",
            },
          ],
          index:2,
        },
      ],
    },
  ],
};
