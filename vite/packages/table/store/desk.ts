import {defineStore} from "pinia";
import dbStorage from "./dbStorage";

export const deskStore = defineStore("desk", {
  state: () => ({
    deskList:[],
    //桌面市场列表
    apiList: [
      {
        cname: '推荐',
        children: [
          {
            id: 1,
            nanoid: "vrEg",
            deskImg: '/img/test/deckImg.jpg', //桌面图片
            desk: '桌面1',
            assort: '推荐',
            title: '效率桌面',
            avatar: '/icons/logo128.png',
            nickName: 'Cordelia Butler',
            sumLikes: 123,
            download: 113,
            time: 1687881600000,
            deskWidth: 1173,
            deskHeight: 668,
            cardsHeight: 519,
            blurb: '一键快速打开系统性能监控面板、一键启动游戏模式、一键退出当前所有打开的应用等等游戏玩家专用的小组件集合。',
            labelList: ['游戏','玩家'],
            cards: [
              {
                "name": "countdownDay",
                "id": 1689081992412,
                "customData": {},
                "_$muuri_id": "b972fe4f-f9e1-4c71-aa01-ea7a41478f3e"
              },
              {
                "name": "timer",
                "id": 1689081873536,
                "customData": {},
                "_$muuri_id": "781c73cb-96ee-47f7-924c-a7fc2157df4d"
              },
              {
                "name": "GamesDiscount",
                "id": 1689081960276,
                "customData": {
                  "id": "cn"
                },
                "_$muuri_id": "eafb4083-41d6-4cab-8f65-89ad3a28e1e4"
              },
              {
                "name": "fish",
                "id": 1689081869660,
                "customData": {},
                "_$muuri_id": "0cc78ee8-e1ab-41ef-ac24-1f1793786afa"
              }
            ],
            settings: {
              "cardZoom": 100,
              "marginTop": 0,
              "cardMargin": 5
            },
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
            nanoid: "Q8XW",
            deskImg: '/img/test/deckImg.jpg',
            desk: '桌面1',
            assort: '推荐',
            title: '游戏玩家必备桌面',
            avatar: '/icons/logo128.png',
            nickName: 'Cordelia Butler',
            sumLikes: 123,
            download: 202,
            time: 1687881800000,
            deskWidth: 1173,
            deskHeight: 800,
            cardsHeight: 708,
            blurb: '一键快速打开系统性能监控面板、一键启动游戏模式、一键退出当前所有打开的应用等等游戏玩家专用的小组件集合。',
            labelList: ['游戏','玩家'],
            cards:  [
              {
                "name": "weather",
                "id": 1689167229464,
                "customData": {},
                "data": {},
                "_$muuri_id": "dc95cc3c-3b09-441b-a7b7-387a0c8f68e5"
              },
              {
                "name": "fish",
                "id": 1689174654809,
                "customData": {},
                "data": {},
                "_$muuri_id": "731b5a76-3b9c-42a3-a1b2-a44b96694697"
              },
              {
                "name": "timer",
                "id": 1689174663222,
                "customData": {},
                "data": {},
                "_$muuri_id": "d1ddd710-3122-488f-b7c2-6ac7ff8c30dc"
              },
              {
                "name": "clocks",
                "id": 1689174690585,
                "customData": {
                  "dragCardSize": "card small",
                  "width": 1,
                  "height": 1,
                  "cardSize": "card small",
                  "clockId": "clock4",
                  "imgUrl": "https://p.ananas.chaoxing.com/star3/origin/fa7d6f2c69aae528484d8278575c28ef.jpg",
                  "blurs": 3,
                  "bgZoom": 0
                },
                "data": {},
                "_$muuri_id": "ce293d14-9f25-4488-a6f7-5bec382e0de2"
              }
            ],
            settings: {
              "cardZoom": 90,
              "marginTop": 0,
              "cardMargin": 5
            },
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
            nanoid: "TKow",
            deskImg: '/img/test/deckImg.jpg',
            desk: '桌面1',
            assort: '推荐',
            title: '效率桌面',
            avatar: '/icons/logo128.png',
            nickName: 'Cordelia Butler',
            sumLikes: 123,
            download: 300,
            time: 1687881700000,
            deskWidth: 1173,
            deskHeight: 668,
            cardsHeight: 551,
            blurb: '一键快速打开系统性能监控面板、一键启动游戏模式、一键退出当前所有打开的应用等等游戏玩家专用的小组件集合。',
            labelList: ['游戏','玩家'],
            cards:  [
              {
                "name": "customTimer",
                "id": 1689175279859,
                "customData": {},
                "data": {},
                "_$muuri_id": "4f4c04e4-eab1-4f81-a6d3-de9c7beda127"
              },
              {
                "name": "ManyFilm",
                "id": 1689175474553,
                "customData": {
                  "width": 2,
                  "height": 2
                },
                "data": {},
                "_$muuri_id": "7582a696-47d7-4b95-a06b-fd1de81e6078"
              }
            ],
            settings: {
              "cardZoom": 100,
              "marginTop": 0,
              "cardMargin": 5
            },
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
    setDeskList(item){
      // this.apiList.map((desk,index) => {
      //   if(desk.cname === item.assort){
      //     this.deskList[index].children.push(item)
      //   }
      // })
    },
  },
  persist: {
    enabled: true,
    strategies: [
      {
        // 自定义存储的 key，默认是 store.$id
        // 可以指定任何 extends Storage 的实例，默认是 sessionStorage
        paths: ['deskList'],
        storage: sessionStorage,
        // state 中的字段名，按组打包储存
      },
    ],
  },
});
