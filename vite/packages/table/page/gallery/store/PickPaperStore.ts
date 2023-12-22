import { defineStore } from 'pinia';
import dbStorage from '../../../store/dbStorage';
import axios from 'axios';

const pickLightUrl = 'https://api.nguaduot.cn/timeline/cate'; // 获取拾光壁纸分类接口
const wallheavenUrl = 'https://api.nguaduot.cn/wallhaven/cate';


// @ts-ignore
export const pickPaperStore = defineStore('pickPaper',{
 state:()=>({
   pickParams:{
    tabList: [
      { index: "D", title: "最新", value: "date" },
      { index: "S", title: "趋势", value: "score" },
      { index: "R", title: "随机", value: "random" },
    ],
    paperSelect:[
      { name: '拾光',  value: '/timeline/v2', synopsis: '时光如歌,岁月如诗' },
      { name: '贪食鬼', value: '/glutton/journal', synopsis: '饕餮盛宴' },
      // { name: '贪吃蛇', value: '/snake/v2', synopsis: '暂无简介' },
      { name: 'wallhaven', value: '/wallhaven/v2', synopsis: 'The best wallpapers on the Net' }
    ],
    paperList:[
      { name:'全部',value:'' },
      { name:'风光摄影',value:'landscape' },
      { name:'人像摄影',value:'portrait' },
      { name:'人文摄影',value:'culture' },
      { name: "静物摄影", value: 'still' },
      { name:'节气摄影',value:'term' },
    ],
    wallhavenList:[
      {name:'全部',value:'',},
      {name:'动漫精选',value:'anime', },
      {name:'热门精选',value:'general'},
      {name:'人物精选',value:'people',}
    ],

    setting:{
      tabValue:{ index: "D", title: "最新", value: "date" },
      paperValue:'/timeline/v2',
      score: 99999999,
      no: 99999999,
      dateTime: 20500101,
      cateValue:'landscape',
    },
   },
 }),

 actions:{
    
 },

 persist: {
  enabled: true,
  strategies: [
    {
      paths: ['pickParams'],
      storage: dbStorage,
    },
  ],
 },

})