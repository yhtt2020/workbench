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
    info: "了解关于桌面的使用方式和技巧，添加一个桌面、小组件、导航图表以及设置你的桌面壁纸。",
    tasks: [
      {
        id: "M0101",
        title: "添加一个桌面小组件",
        pre: "/",
        suf: "M0102",
        guide: true,
        repeatable: "是",
        frequency: "一次",
        intro:
          "你可以按照需要自由添加自己喜欢的小组件，来搭配自己的桌面，同时绝大多数小组件都支持同时添加多个，以实现不同的功能和用途。",
        description:
          "在桌面空白处「单击右键」，在底部出现的操作栏中选择「添加小组件」。选择「时钟」小组件，点击图片可以预览功能，点击添加按钮将小组件添加到当前桌面上。",
      },
      {
        id: "M0102",
        title: "添加一个桌面",
        pre: "M0101",
        suf: "M0103",
        guide: true,
        repeatable: "是",
        frequency: "一次",
        intro:
          "喜欢的小组件太多？一个桌面放不下，没关系我们还支持创建多个桌面，每个桌面都有自己独立的设置，可以添加不同的小组件。",
        description:
          "在桌面空白处「单击右键」，在底部出现的操作栏中选择「添加桌面」；输入「桌面标题」，点击「立即添加」即可完成创建。",
      },
      {
        id: "M0103",
        title: "设置一个桌面壁纸",
        pre: "M0102",
        suf: "M0201",
        guide: true,
        repeatable: "是",
        frequency: "一次",
        intro:
          "工作台背景太单调？我们提供了自定义壁纸功能，支持选择内置的开源壁纸，或者你可以手动上传自己喜欢的壁纸。",

        description:
          "在桌面空白处「单击右键」，在底部出现的操作栏中选择「设置」，点击进行桌面设置，在这里你可以点击「设置壁纸」进入「壁纸应用」，选择开放的壁纸源或则手动上传自己的本地图片。",
      },
      // {
      //   id: "M0104",
      //   title: "添加一个导航图标",
      //   pre: "M0103",
      //   suf: "M0201",
      //   // suf: "",
      //   guide: true,
      //   repeatable: "是",
      //   frequency: "一次",
      //   intro:
      //     "工作台提供了强大的底部和侧边导航栏，你可以按照需要自定义修改需要放置的应用或图标。",
      //   description:
      //     "在导航栏上「单击右键」，在底部出现的操作栏中选择「编辑导航」，即可进入导航栏编辑模式，随意拖动排序、拖出删除，点击「添加」选择需要添加的应用或图标，修改后为自动保存。",
      // },
    ],
  },
  {
    chapter: "第二章",
    info: "了解关于如果导入你的系统文件或应用图标到桌面，如何添加图标以及如何对图标进行分组。",
    tasks: [
      {
        id: "M0201",
        title: "使用批量导入功能导入桌面图标",
        pre: "M0103",
        suf: "M0301",
        repeatable: "是",
        frequency: "一次",
        guide: true,
        intro:
          "想要在工作台中快速访问系统桌面图标，仅需几步简单操作即可一键导入桌面图标，在工作台中自由管理和拖放。",
        description:
          "在桌面空白处「单击右键」，在底部出现的操作栏中选择「添加图标」，在后续弹窗中就可以选择导入桌面图标，还可以选择其他应用快捷方式或网页应用链接。",
      },
      // {
      //   id: "M0202",
      //   title: "创建一个图标分组",
      //   pre: "M0201",
      //   suf: "M0301",
      //   guide: true,
      //   repeatable: "是",
      //   frequency: "一次",
      //   intro:
      //     "导入了那么多图标，也不用担心如何整理，工作台提供了图标分组功能，你可以自由选择分组，就和你的手机App一样。",
      //   description:
      //     "在图标上「单击右键」，在底部出现的操作栏中选择「移动」，然后选择你想要合并的图标上「单击右键」，在底部菜单中选择「合并」即可",
      // },
    ],
  },
  {
    chapter: "第三章",
    info: "了解如何进一步个性化你的工作台，使用一个来自社区分享的桌面和小组件。",
    tasks: [
      {
        id: "M0301",
        title: "自定义工作台主题颜色",
        pre: "M0201",
        suf: "M0302",
        repeatable: "是",
        frequency: "一次",
        guide: true,
        intro: "你可以自由修改工作台的主题颜色和文字颜色，来搭配你的桌面壁纸。",
        description:
          "在「设置」页面，点击「主题颜色」，在打开的抽屉弹窗中你可以选择指定的主题颜色，或使用颜色选择器来自定义选择。",
      },
      {
        id: "M0302",
        title: "使用一个社区分享的桌面",
        pre: "M0301",
        suf: "M0401",
        guide: true,
        repeatable: "是",
        frequency: "一次",
        intro:
          "搭建不出自己满意的桌面？没关系，创意市场提供了大量社区用户分享的桌面方案，快来挑选吧。",
        description:
          "在桌面空白处「单击右键」，在底部出现的操作栏中选择「添加桌面」，在弹出的侧边抽屉中可以看到「热门桌面」",
      },
      // {
      //   id: "M0303",
      //   title: "使用一个社区分享的外部小组件",
      //   pre: "M0302",
      //   suf: "M0401",
      //   guide: true,
      //   repeatable: "是",
      //   frequency: "一次",
      //   intro:
      //     "没有自己想要的小组件？我们提供的自定义小组件支持添加url地址，来实现将外部网页变为桌面小组件。",
      //   description:
      //     "打开「外部小组件」的底部操作菜单，选择「发现」，在弹窗中可以选择社区用户分享的方案，点击「添加」即可选择直接覆盖当前小组件数据或者在桌面上直接添加一个新的小组件。",
      // },
    ],
  },
  {
    chapter: "第四章",
    info: "了解如何更便捷的使用工作台，尝试使用快捷键启动。",
    tasks: [
      {
        id: "M0401",
        title: "使用快捷键呼出工作台",
        pre: "M0302",
        suf: "",
        repeatable: "是",
        frequency: "一次",
        guide: true,
        intro:
          "看来你已经熟悉了工作台的主要核心功能，来试下使用快捷键，进一步提升打开体验。",
        description:
          "在「设置」页面，点击「通用设置」，可以看到「按键」菜单，在这里你可以自定义设置适合的快捷键。",
      },
    ],
  },
];
