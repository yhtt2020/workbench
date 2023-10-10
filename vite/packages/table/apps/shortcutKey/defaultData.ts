let keyData = [
  {
    id: 1,  //唯一标识
    icon: 'https://s1.hdslb.com/bfs/static/jinkela/popular/assets/icon_popular.png', //方案的图片
    name: 'Adobe Lightroom', //方案名称
    number: 92, //快捷键总数
    commonUse: 'Lr常用26个快捷键', //方案简介
    avatar: '/icons/logo128.png', //方案人
    nickName: 'Victor Ruiz', //头像
    sumLikes: 12334, //总赞数
    download: 39, //下载次数
    key: '快捷键',
    time: 1686462400000, //时间轴
    isDownload: true, //是否下载
    isLike: false,  //是否点赞
    isMyCreate: false, //是否是自己创建
    isShare: false, //是否分享到社区
    isCommunity: true, //是否来自社区
    keyList: [
      {
        id: 1,//唯一标识
        groupName: '常用',
        isEdit: false
      },
      {
        id: 2,
        keys: ['Space', 'H', '3'],
        keyStr: 'Space + H + 3',
        // 用于区分编辑的键一键二
        keyArr: [
          {
            field: 'modifierKeyTwo',
            index: 1,
            key: 'Space'
          },
          {
            field: 'keyList[0]',
            index: 7,
            key: 'H'
          },
          {
            field: 'keyList[1]',
            index: 2,
            key: '3'
          }
        ],
        title: '首选项',
        isEdit: false, //是否编辑
        addNote: false, //是否添加备注
        isNote: false, //是否编辑备注，
        noteVal: ''
      },
      {
        id: 3,
        keys: ['Win', 'A'],
        keyStr: 'Win + A',
        keyArr: [
          {
            field: 'modifierKeyOne',
            index: 4,
            key: 'Win'
          },
          {
            field: 'keyList[0]',
            index: 0,
            key: 'A'
          }
        ],
        title: '清除浏览器数据',
        isEdit: false,
        addNote: false,
        isNote: false,
        noteVal: ''
      },
      {
        id: 4,
        keys: ['Tab', 'X'],
        keyStr: 'Tab + X',
        keyArr: [
          {
            field: 'modifierKeyOne',
            index: 3,
            key: 'Tab'
          },
          {
            field: 'keyList[0]',
            index: 23,
            key: 'X'
          }
        ],
        title: '隐藏 Microsoft Edge',
        isEdit: false,
        addNote: false,
        isNote: false,
        noteVal: ''
      },
      {
        id: 5,
        keys: ['Alt', 'Y', 'L'],
        keyStr: 'Alt + Y + L',
        keyArr: [
          {
            field: 'modifierKeyOne',
            index: 6,
            key: 'Alt'
          },
          {
            field: 'keyList[0]',
            index: 24,
            key: 'Y'
          },
          {
            field: 'keyList[0]',
            index: 11,
            key: 'L'
          }
        ],
        title: '通过系统对话框打印',
        isEdit: false,
        addNote: false,
        isNote: false,
        noteVal: ''
      },
      {
        id: 6,
        groupName: '文件',
        isEdit: false
      },
      {
        id: 7,
        keys: ['Ctrl', 'Q'],
        keyStr: 'Ctrl + Q',
        keyArr: [
          {
            field: 'modifierKeyTwo',
            index: 0,
            key: 'Ctrl'
          },
          {
            field: 'keyList[0]',
            index: 16,
            key: 'Q'
          }
        ],
        title: '打印',
        isEdit: false
      },
      {
        id: 8,
        keys: ['Ctrl', 'I', 'K'],
        keyStr: 'Ctrl + I + K',
        keyArr: [
          {
            field: 'modifierKeyOne',
            index: 0,
            key: 'Ctrl'
          },
          {
            field: 'keyList[0]',
            index: 8,
            key: 'I'
          },
          {
            field: 'keyList[0]',
            index: 10,
            key: 'K'
          }
        ],
        title: '隐藏其他',
        isEdit: false
      },
      {
        id: 9,
        keys: ['Tab', 'X', 'W'],
        keyStr: 'Tab + X + W',
        keyArr: [
          {
            field: 'modifierKeyTwo',
            index: 3,
            key: 'Tab'
          },
          {
            field: 'keyList[0]',
            index: 23,
            key: 'X'
          },
          {
            field: 'keyList[0]',
            index: 22,
            key: 'W'
          }
        ],
        title: '电子邮件链接',
        isEdit: false
      },
      {
        id: 10,
        keys: ['Tab', 'Ctrl', 'E'],
        keyStr: 'Tab + Ctrl + E',
        keyArr: [
          {
            field: 'modifierKeyTwo',
            index: 3,
            key: 'Tab'
          },
          {
            field: 'modifierKeyOne',
            index: 0,
            key: 'Ctrl'
          },
          {
            field: 'keyList[0]',
            index: 4,
            key: 'E'
          }
        ],
        title: '新建 InPrivate 窗口',
        isEdit: false
      },
      {
        id: 11,
        keys: ['Fn', 'Ctrl', 'L'],
        keyStr: 'Fn + Ctrl + L',
        keyArr: [
          {
            field: 'modifierKeyTwo',
            index: 5,
            key: 'Fn'
          },
          {
            field: 'modifierKeyOne',
            index: 0,
            key: 'Ctrl'
          },
          {
            field: 'keyList[0]',
            index: 11,
            key: 'L'
          }
        ],
        title: '关闭标签页',
        isEdit: false
      },
      {
        id: 12,
        keys: ['Ctrl', 'V'],
        keyStr: 'Ctrl + V',
        keyArr: [
          {
            field: 'modifierKeyTwo',
            index: 0,
            key: 'Ctrl'
          },
          {
            field: 'keyList[0]',
            index: 21,
            key: 'V'
          }
        ],
        title: '页面另存为',
        isEdit: false
      },
      {
        id: 13,
        groupName: '其他',
        isEdit: false
      },
      {
        id: 14,
        keys: ['Alt', 'D', 'X'],
        keyStr: 'Alt + D + X',
        keyArr: [
          {
            field: 'modifierKeyOne',
            index: 6,
            key: 'Alt'
          },
          {
            field: 'keyList[0]',
            index: 3,
            key: 'D'
          },
          {
            field: 'keyList[0]',
            index: 23,
            key: 'X'
          }
        ],
        title: '退出 Microsoft Edge',
        isEdit: false
      },
      {
        id: 15,
        keys: ['Ctrl', '.'],
        keyStr: 'Ctrl + .',
        keyArr: [
          {
            field: 'modifierKeyTwo',
            index: 0,
            key: 'Ctrl'
          },
          {
            field: 'keyList[1]',
            index: 16,
            key: '.'
          }
        ],
        title: '退出并保留窗口',
        isEdit: false
      },
    ]
  },
  {
    id: 2,
    icon: 'http://a.apps.vip/icons/flappy.jpg',
    name: 'Adobe InDesign',
    number: 92,
    commonUse: 'Lr常用26ety个快捷键',
    avatar: '/icons/logo128.png',
    nickName: 'Victor Ruiz',
    sumLikes: 12334,
    download: 232,
    key: '快捷键',
    time: 1685462400012,
    isDownload: true,
    isLike: false,
    isMyCreate: false,
    isShare: false,
    isCommunity: true,
    keyList: [
      {
        id: 1,//唯一标识
        groupName: '常用',
        isEdit: false
      },
      {
        id: 2,
        keys: ['Space', 'H', '3'],
        keyStr: 'Space + H + 3',
        // 用于区分编辑的键一键二
        keyArr: [
          {
            field: 'modifierKeyTwo',
            index: 1,
            key: 'Space'
          },
          {
            field: 'keyList[0]',
            index: 7,
            key: 'H'
          },
          {
            field: 'keyList[1]',
            index: 2,
            key: '3'
          }
        ],
        title: '首选项',
        isEdit: false
      },
      {
        id: 3,
        keys: ['Win', 'A'],
        keyStr: 'Win + A',
        keyArr: [
          {
            field: 'modifierKeyOne',
            index: 4,
            key: 'Win'
          },
          {
            field: 'keyList[0]',
            index: 0,
            key: 'A'
          }
        ],
        title: '清除浏览器数据',
        isEdit: false
      },
      {
        id: 4,
        keys: ['Tab', 'X'],
        keyStr: 'Tab + X',
        keyArr: [
          {
            field: 'modifierKeyOne',
            index: 3,
            key: 'Tab'
          },
          {
            field: 'keyList[0]',
            index: 23,
            key: 'X'
          }
        ],
        title: '隐藏 Microsoft Edge',
        isEdit: false
      },
      {
        id: 5,
        keys: ['Alt', 'Y', 'L'],
        keyStr: 'Alt + Y + L',
        keyArr: [
          {
            field: 'modifierKeyOne',
            index: 6,
            key: 'Alt'
          },
          {
            field: 'keyList[0]',
            index: 24,
            key: 'Y'
          },
          {
            field: 'keyList[0]',
            index: 11,
            key: 'L'
          }
        ],
        title: '通过系统对话框打印',
        isEdit: false
      },
      {
        id: 6,
        groupName: '文件',
        isEdit: false
      },
      {
        id: 7,
        keys: ['Ctrl', 'Q'],
        keyStr: 'Ctrl + Q',
        keyArr: [
          {
            field: 'modifierKeyTwo',
            index: 0,
            key: 'Ctrl'
          },
          {
            field: 'keyList[0]',
            index: 16,
            key: 'Q'
          }
        ],
        title: '打印',
        isEdit: false
      },
      {
        id: 8,
        keys: ['Ctrl', 'I', 'K'],
        keyStr: 'Ctrl + I + K',
        keyArr: [
          {
            field: 'modifierKeyOne',
            index: 0,
            key: 'Ctrl'
          },
          {
            field: 'keyList[0]',
            index: 8,
            key: 'I'
          },
          {
            field: 'keyList[0]',
            index: 10,
            key: 'K'
          }
        ],
        title: '隐藏其他',
        isEdit: false
      },
      {
        id: 9,
        keys: ['Tab', 'X', 'W'],
        keyStr: 'Tab + X + W',
        keyArr: [
          {
            field: 'modifierKeyTwo',
            index: 3,
            key: 'Tab'
          },
          {
            field: 'keyList[0]',
            index: 23,
            key: 'X'
          },
          {
            field: 'keyList[0]',
            index: 22,
            key: 'W'
          }
        ],
        title: '电子邮件链接',
        isEdit: false
      },
      {
        id: 10,
        keys: ['Tab', 'Ctrl', 'E'],
        keyStr: 'Tab + Ctrl + E',
        keyArr: [
          {
            field: 'modifierKeyTwo',
            index: 3,
            key: 'Tab'
          },
          {
            field: 'modifierKeyOne',
            index: 0,
            key: 'Ctrl'
          },
          {
            field: 'keyList[0]',
            index: 4,
            key: 'E'
          }
        ],
        title: '新建 InPrivate 窗口',
        isEdit: false
      },
    ]
  }
]
export default keyData
