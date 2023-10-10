import {defineStore} from "pinia";
import dbStorage from "../../store/dbStorage";
import {nanoid} from "nanoid";

import {keyData,appMap} from './defaultData'
import {useRouter} from 'vue-router'
// @ts-ignore
export const keyStore = defineStore("key", {
  state: () => ({
    currentApp: {
      software: {}
    },//当前应用
    executedApps: [],//运行过的应用

    customApps: [],//自定义应用，就是那些我们没定义的应用
    sessionList: [],//会话列表
    //快捷键方案列表
    // shortcutKeyList: [...keyData.concat()],
    shortcutKeyList: [],
    // 最近使用的快捷键方案列表
    recentlyUsedList: [],
    // 推荐方案列表
    // sellSchemeList: [...keyData.concat()],
    sellSchemeList: [...keyData.concat()],
    //创意市场列表
    marketList: [
      {
        cname: '推荐',
        children: [
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
            commonUse: 'Lr常用26个快捷键',
            avatar: '/icons/logo128.png',
            nickName: 'Russell Morgan',
            sumLikes: 134,
            download: 2342,
            key: '快捷键',
            time: 168546240012,
            isDownload: false,
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
            id: 3,
            icon: 'https://s1.hdslb.com/bfs/static/jinkela/popular/assets/icon_popular.png',
            name: 'Microsoft Edge',
            number: 92,
            commonUse: 'Lr常用26个快捷键',
            avatar: '',
            nickName: 'Virginia Casey',
            sumLikes: 1334,
            download: 232,
            key: '快捷键',
            time: 168546240012,
            isDownload: false,
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
            ]
          },
          {
            id: 100,
            icon: 'http://a.apps.vip/icons/flappy.jpg',
            name: 'Adobe Lightroom',
            number: 92,
            commonUse: 'Lr常用26个快捷键',
            avatar: '',
            nickName: 'Virginia Casey',
            sumLikes: 1334,
            download: 232,
            key: '快捷键',
            time: 168546240012,
            isDownload: false,
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
            ]
          },
        ]
      },
      {
        cname: '游戏',
        children: [
          {
            id: 4,
            icon: 'http://a.apps.vip/icons/flappy.jpg',
            name: 'Adobe Lightroom',
            number: 92,
            commonUse: 'Lr常用26个快捷键',
            avatar: '',
            nickName: 'Virginia Casey',
            sumLikes: 1334,
            download: 232,
            key: '快捷键',
            time: 168546240012,
            isDownload: false,
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
            ]
          },
          {
            id: 5,
            icon: 'https://res.wx.qq.com/a/wx_fed/assets/res/OTE0YTAw.png',
            name: 'Adobe Lightroom',
            number: 92,
            commonUse: 'Lr常用26个快捷键',
            avatar: '/icons/logo128.png',
            nickName: 'Russell Morgan',
            sumLikes: 134,
            download: 2342,
            key: '快捷键',
            time: 168546240012,
            isDownload: false,
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
            id: 6,
            icon: 'http://a.apps.vip/icons/flappy.jpg',
            name: 'Adobe XD',
            number: 92,
            commonUse: 'Lr常用26个快捷键',
            avatar: '/icons/logo128.png',
            nickName: 'Terry Sandoval',
            sumLikes: 1314,
            download: 2342,
            key: '快捷键',
            time: 168546220012,
            isDownload: false,
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
        ]
      },
      {
        cname: '效率',
        children: [
          {
            id: 7,
            icon: 'http://a.apps.vip/icons/flappy.jpg',
            name: 'Adobe Lightroom',
            number: 92,
            commonUse: 'Lr常用26个快捷键',
            avatar: '/icons/logo128.png',
            nickName: 'Russell Morgan',
            sumLikes: 134,
            download: 2342,
            key: '快捷键',
            time: 168546240012,
            isDownload: false,
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
            id: 8,
            icon: 'https://s1.hdslb.com/bfs/static/jinkela/popular/assets/icon_popular.png',
            name: 'Adobe InDesign',
            number: 92,
            commonUse: 'Lr常用26个快捷键',
            avatar: '/icons/logo128.png',
            nickName: 'Russell Morgan',
            sumLikes: 134,
            download: 2342,
            key: '快捷键',
            time: 168546240012,
            isDownload: false,
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
            id: 9,
            icon: 'http://a.apps.vip/icons/flappy.jpg',
            name: 'Adobe Lightroom',
            number: 92,
            commonUse: 'Lr常用26个快捷键',
            avatar: '',
            nickName: 'Virginia Casey',
            sumLikes: 1334,
            download: 232,
            key: '快捷键',
            time: 168546240012,
            isDownload: false,
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
            ]
          },
        ]
      },
      {
        cname: '办公',
        children: [
          {
            id: 10,
            icon: 'http://a.apps.vip/icons/flappy.jpg',
            name: 'Adobe InDesign',
            number: 92,
            commonUse: 'Lr常用26个快捷键',
            avatar: '/icons/logo128.png',
            nickName: 'Russell Morgan',
            sumLikes: 134,
            download: 2342,
            key: '快捷键',
            time: 168546240012,
            isDownload: false,
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
            id: 11,
            icon: 'https://s1.hdslb.com/bfs/static/jinkela/popular/assets/icon_popular.png',
            name: 'Microsoft Edge',
            number: 92,
            commonUse: 'Lr常用26个快捷键',
            avatar: '',
            nickName: 'Virginia Casey',
            sumLikes: 1334,
            download: 232,
            key: '快捷键',
            time: 168546240012,
            isDownload: false,
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
            ]
          },
        ]
      },
      {
        cname: '系统',
        children: [
          {
            id: 12,
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
      },
      {
        cname: '娱乐',
        children: [
          {
            id: 5,
            icon: 'https://res.wx.qq.com/a/wx_fed/assets/res/OTE0YTAw.png',
            name: 'Adobe Lightroom',
            number: 92,
            commonUse: 'Lr常用26个快捷键',
            avatar: '/icons/logo128.png',
            nickName: 'Russell Morgan',
            sumLikes: 134,
            download: 2342,
            key: '快捷键',
            time: 168546240012,
            isDownload: false,
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
                id: 13,
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
        ]
      },
      {
        cname: '其他',
        children: [
          {
            id: 14,
            icon: 'http://a.apps.vip/icons/flappy.jpg',
            name: 'Adobe Lightroom',
            number: 92,
            commonUse: 'Lr常用26个快捷键',
            avatar: '',
            nickName: 'Virginia Casey',
            sumLikes: 1334,
            download: 232,
            key: '快捷键',
            time: 168546240012,
            isDownload: false,
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
            ]
          },
        ]
      },
      {
        cname: '我的分享',
        children: []
      },
    ],
    schemeList: [],
    settings: {
      enableAutoChange: false,
      enableAutoEnter: false,
    }
  }),
  actions: {
    async loadShortcutSchemes(exeName) {
      const dbKey = 'shortcut:scheme:'

      let map: any = {
        _id: {
          $regex: new RegExp(`^${dbKey}`)
        },
      }
      if (exeName) {
        map.exeName = exeName
      }
      await tsbApi.db.createIndex({
        index: {
          fields: ['exeName']
        }
      })
      let rs = (await tsbApi.db.find({
        selector: map,
        sort: [
          {
            '_id': 'desc',
          }
        ]
      })).docs

      let schemes = rs
      // if(this.schemeList.length===0){
      //  //  for (const scheme of keyData) {
      //  //    let rs=await tsbApi.db.put({
      //  //      _id: 'shortcut:scheme:'+Date.now(),
      //  //      ...scheme
      //  //    })
      //  //    console.log(rs,'添加')
      //  //    if(rs.ok){
      //  //      schemes.push(rs.doc)
      //  //    }
      //  //  }
      //  // // console.log(schemes,'方案列表')
      //
      //  // this.schemeList=[...keyData.concat()]
      // }
      return schemes
    },
    setRecentlyUsedList(item) {
      this.recentlyUsedList.forEach((i, index) => {
        if (i.id === item.id) this.recentlyUsedList.splice(index, 1)
      })
      this.recentlyUsedList.unshift(item)
    },
    setSchemeList(item) {
      this.shortcutKeyList.find((i, index) => {
        if (i.id === item.id) {
          this.shortcutKeyList.splice(index, 1, item)
        }
      })
    },
    async saveScheme(scheme) {
      let rs = await tsbApi.db.put({
        ...scheme
      })
      if (rs.ok) {
        return rs.doc
      }
    },
    async addScheme(scheme, exeName) {
      let rs = await tsbApi.db.put({
        _id: 'shortcut:scheme:' + Date.now(),
        ...scheme,
        exeName: exeName
      })
      if (rs.ok) {
        return rs.doc
      }
    },
    setShortcutKeyList(item) {
      this.shortcutKeyList.push(JSON.parse(JSON.stringify(item)))
    },
    async removeShortcutKeyList(item) {
      await tsbApi.db.remove(item)
      // let itemIndex = this.items.findIndex(li => {
      //   if (li._id === item._id) {
      //     return true
      //   }
      // })
      // if (itemIndex > -1) {
      //   this.items.splice(itemIndex, 1)
      // }
      // this.shortcutKeyList.map((i, index) => {
      //   if (item.id === i.id) this.shortcutKeyList.splice(index, 1)
      // })
      this.recentlyUsedList.map((i, index) => {
        if (item.id === i.id) this.recentlyUsedList.splice(index, 1)
      })
      this.marketList[this.marketList.length - 1].children.map((i, index) => {
        if (item.id === i.id) this.marketList[this.marketList.length - 1].children.splice(index, 1)
      })
    },
    setMarketList(item) {
      if (this.marketList[this.marketList.length - 1].children.find(i => i.id === item.id)) {
        this.marketList[this.marketList.length - 1].children.find((i, index) => {
          if (i.id === item.id) {
            this.marketList[this.marketList.length - 1].children.splice(index, 1, item)
          }
        })
        this.setSchemeList(item)
      } else {
        this.marketList[this.marketList.length - 1].children.push(item)
        if (this.shortcutKeyList.find(i => i.id === item.id)) {
          this.setSchemeList(item)
        } else {
          this.setShortcutKeyList(item)
        }
      }
    },
    delRecentlyEmpty({keyList, id}) {
      this.recentlyUsedList.forEach((item, index) => {
        if (item.id == id) {
          this.recentlyUsedList[index].keyList = keyList
        }
      })
    },
    async getRepApp(exeName, filePath) {
      return await this.getCustomApp(exeName, filePath)
    },
    /**
     * 获取应用，如果不存在，则根据filePath自动拉取icon，并创建新的应用信息
     * @param exeName
     * @param filePath
     */ async getCustomApp(exeName, filePath = '') {
      let found = this.customApps.find(item => {
        return item.exeName === exeName
      })

      if (found) {
        return found
      } else {
        let foundRep = appMap.find(app => {
          if (typeof app.exeName == 'string') {
            return app.exeName === exeName
          } else {
            return app.exeName.includes(exeName)
          }
        }) || {}
        let icon = await tsbApi.system.extractFileIcon(filePath)
        let newApp = {
          company: '',
          alias: exeName,
          exeName: exeName,
          ...foundRep,
          icon: icon || '/icons/winapp.png',
          path: filePath,
          id: nanoid(8)
        }
        this.customApps.push(newApp)
        return newApp
      }
    },
    async removeCustomApp(app) {
      console.log('要删除的app', app)
      let found = this.customApps.findIndex(item => {
        return item.id === app.id
      })
      console.log('只掉位置', found)
      if (found > -1) {
        this.customApps.splice(found, 1)
      }

      let foundExecutedApp = this.executedApps.findIndex(item => {
        console.log(item,app.exeName)
        return item.exeName === app.exeName
      })
      if (foundExecutedApp > -1) {
        this.executedApps.splice(foundExecutedApp, 1)
      }
      await this.syncSessionList()
    },
    async syncSessionList(cb) {
      this.sessionList = this.executedApps.map(app => {
        return {
          img: app.software.icon,
          title: app.software.alias,
          id: app.exeName,
          noBg: true,
          callBack: () => {
            this.currentApp = app
            if (cb) {
              cb(app)
            } else {
              useRouter().push({
                name: 'schemeList',
                params: {
                  exeName: app.exeName
                }
              })
            }
          }
        }
      })
    }
  },
  persist: {
    enabled: true,
    strategies: [
      {
        // 自定义存储的 key，默认是 store.$id
        // 可以指定任何 extends Storage 的实例，默认是 sessionStorage
        paths: ['customApps', 'shortcutKeyList', 'recentlyUsedList', 'sellSchemeList', 'marketList', 'sessionList', 'executedApps', 'currentApp'],
        storage: dbStorage,
        // state 中的字段名，按组打包储存
      },
    ],
  },
});
