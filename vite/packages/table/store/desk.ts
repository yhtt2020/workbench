import {defineStore} from "pinia";
import dbStorage from "./dbStorage";

export const deskStore = defineStore("desk", {
  state: () => ({
    //桌面市场列表
    deskList: [
      {
        cname: '推荐',
        children: [
          {
            id: 1, //唯一标识
            deskImg: '/img/test/deckImg.jpg', //桌面图片
            desk: '桌面1',
            assort: '推荐',
            title: '效率桌面',
            avatar: '/icons/logo128.png',
            nickName: 'Cordelia Butler',
            sumLikes: 123,
            download: 113,
            time: 1687881600000,
            size: '1172x662',
            cardsHeight: 519,
            blurb: '一键快速打开系统性能监控面板、一键启动游戏模式、一键退出当前所有打开的应用等等游戏玩家专用的小组件集合。',
            labelList: ['游戏','玩家'],
            cardList: [
              { 
                icon: 'dianzan',
                name: "我的游戏",
              },
              { 
                icon: 'dianzan',
                name: "Steam特惠",
              },
            ],
          },
          {
            id: 2, 
            deskImg: '/img/test/deckImg.jpg', 
            desk: '桌面1',
            assort: '推荐',
            title: '游戏玩家必备桌面',
            avatar: '/icons/logo128.png',
            nickName: 'Cordelia Butler',
            sumLikes: 123,
            download: 202,
            time: 1687881800000,
            size: '1920x1080',
            blurb: '一键快速打开系统性能监控面板、一键启动游戏模式、一键退出当前所有打开的应用等等游戏玩家专用的小组件集合。',
            labelList: ['效率','产品经理'],
            cardList: [
              { 
                icon: 'dianzan',
                name: "我的游戏",
              },
              { 
                icon: 'dianzan',
                name: "Steam特惠",
              },
            ],
          },
          {
            id: 3,
            deskImg: '/img/test/deckImg.jpg',
            desk: '桌面1',
            assort: '推荐',
            title: '效率桌面',
            avatar: '/icons/logo128.png',
            nickName: 'Cordelia Butler',
            sumLikes: 123,
            download: 300,
            time: 1687881700000,
            size: '1920x1080',
            blurb: '一键快速打开系统性能监控面板、一键启动游戏模式、一键退出当前所有打开的应用等等游戏玩家专用的小组件集合。',
            labelList: ['游戏','玩家'],
            cardList: [
              { 
                icon: 'dianzan',
                name: "我的游戏",
              },
              { 
                icon: 'dianzan',
                name: "Steam特惠",
              },
            ],
          }
        ]
      },
      {
        cname: '游戏',
        children: []
      },
      {
        cname: '效率',
        children: []
      },
      {
        cname: '办公',
        children: []
      },
      {
        cname: '日常',
        children: []
      },
      {
        cname: '娱乐',
        children: []
      },
      {
        cname: '创意',
        children: []
      },
      {
        cname: '我的分享',
        children: []
      },
    ],
  }),
  actions: {
  },
  persist: {
    enabled: true,
    strategies: [
      {
        // 自定义存储的 key，默认是 store.$id
        // 可以指定任何 extends Storage 的实例，默认是 sessionStorage
        paths: ['deskList'],
        storage: localStorage,
        // state 中的字段名，按组打包储存
      },
    ],
  },
});
