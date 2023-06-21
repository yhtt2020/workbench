import {defineStore} from "pinia";
import dbStorage from "./dbStorage";

let arrData = [
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
        groupName: '常用',
        id: 1,
      },
      {
        id: 2,
        keys: [
          {icon: 'linechart'},
          {key: 'H'}
        ],
        title: '首选项',
      },
      {
        id: 3,
        keys: [
          {icon: 'linechart'},
          {icon: 'linechart'},
          {key: 'Q'}
        ],
        title: '清除浏览器数据',
      },
      {
        id: 4,
        keys: [
          {icon: 'linechart'},
          {key: 'H'}
        ],
        title: '隐藏 Microsoft Edge'
      },
      {
        id: 5,
        keys: [
          {icon: 'linechart'},
          {key: 'H'}
        ],
        title: '隐藏 Microsoft Edge'
      },
      {
        groupName: '文件',
        id: 6,
      },
      {
        id: 7,
        keys: [
          {icon: 'linechart'},
          {key: 'H'}
        ],
        title: '首选项',
      },
      {
        id: 8,
        keys: [
          {icon: 'linechart'},
          {icon: 'linechart'},
          {key: 'Q'}
        ],
        title: '清除浏览器数据',
      },
      {
        id: 9,
        keys: [
          {icon: 'linechart'},
          {key: 'H'}
        ],
        title: '隐藏 Microsoft Edge'
      },
      {
        id: 10,
        keys: [
          {icon: 'linechart'},
          {key: 'H'}
        ],
        title: '隐藏 Microsoft Edge'
      },
      {
        id: 11,
        keys: [
          {icon: 'linechart'},
          {key: 'H'}
        ],
        title: '娄山关路'
      },
      {
        id: 12,
        keys: [
          {icon: 'linechart'},
          {key: 'H'}
        ],
        title: '阿里的第三个的'
      },
      {
        groupName: '其他',
        id: 13,
      },
      {
        id: 14,
        keys: [
          {icon: 'linechart'},
          {key: 'H'}
        ],
        title: '首选项',
      },
      {
        id: 15,
        keys: [
          {icon: 'linechart'},
          {icon: 'linechart'},
          {key: 'Q'}
        ],
        title: '清除浏览器数据',
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
        groupName: '分类1',
        id: 1,
      },
      {
        id: 2,
        keys: [
          {icon: 'linechart'},
          {key: 'H'}
        ],
        title: '首选项',
      },
      {
        id: 3,
        keys: [
          {icon: 'linechart'},
          {icon: 'linechart'},
          {key: 'Q'}
        ],
        title: '清除浏览器数据',
      },
      {
        id: 4,
        keys: [
          {icon: 'linechart'},
          {key: 'H'}
        ],
        title: '隐藏 Microsoft Edge'
      },
      {
        id: 5,
        keys: [
          {icon: 'linechart'},
          {key: 'H'}
        ],
        title: '隐藏 Microsoft Edge'
      },
      {
        groupName: '分类23',
        id: 6,
      },
      {
        id: 7,
        keys: [
          {icon: 'linechart'},
          {key: 'H'}
        ],
        title: '首选项',
      },
      {
        id: 8,
        keys: [
          {icon: 'linechart'},
          {icon: 'linechart'},
          {key: 'Q'}
        ],
        title: '清除浏览器数据',
      },
      {
        id: 9,
        keys: [
          {icon: 'linechart'},
          {key: 'H'}
        ],
        title: '隐藏 Microsoft Edge'
      },
      {
        id: 10,
        keys: [
          {icon: 'linechart'},
          {key: 'H'}
        ],
        title: '隐藏 Microsoft Edge'
      },
      {
        id: 11,
        keys: [
          {icon: 'linechart'},
          {key: 'H'}
        ],
        title: '娄山关路'
      },
      {
        id: 12,
        keys: [
          {icon: 'linechart'},
          {key: 'H'}
        ],
        title: '阿里的第三个的'
      }
    ]
  }
]

export const keyStore = defineStore("key", {
  state: () => ({
    //快捷键方案列表
    shortcutKeyList: [...arrData.concat()],
    // 最近使用的快捷键方案列表
    recentlyUsedList: [],
    // 推荐方案列表
    sellSchemeList: [...arrData.concat()]
  }),
  actions: {
    setRecentlyUsedList(item){
      this.recentlyUsedList.forEach((i,index) => {
        if(i.id === item.id) this.recentlyUsedList.splice(index,1)
      })
      this.recentlyUsedList.unshift(item)
    },
    setSchemeList(item){
      this.shortcutKeyList.find((i,index) => {
        if(i.id === item.id){
          this.shortcutKeyList.splice(index,1,item)
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
        paths: ['shortcutKeyList','recentlyUsedList','sellSchemeList'],
        storage: dbStorage,
        // state 中的字段名，按组打包储存
      },
    ],
  },
});
