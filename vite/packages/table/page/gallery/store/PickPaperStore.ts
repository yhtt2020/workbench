import { defineStore } from 'pinia';
import dbStorage from '../../../store/dbStorage';
import axios from 'axios';

// @ts-ignore
export const pickPaperStore = defineStore('pickPaper',{
 state:()=>({
   pickParams:{
    // 排序
    tabList: [
      { index: "D", name: "最新", value: "date" },
      { index: "S", name: "趋势", value: "score" },
      { index: "R", name: "随机", value: "random" },
    ],

    // 接口参数
    paperSelect:[
      { name: '拾光',  value: '/timeline/v3', synopsis: '时光如歌,岁月如诗' },
      { name: '贪食鬼', value: '/glutton/v3', synopsis: '饕餮盛宴' },
      { name: '贪吃蛇', value: '/snake/v3', synopsis: '' },
      { name: 'wallhaven', value: '/wallhaven/v3', synopsis: 'The best wallpapers on the Net' }
    ],

    // 子类参数
    paperList:[
      { name:'全部',value:'' },
      { name:'风光',value:'landscape' },
      { name:'人物',value:'character' },
      { name:'生灵',value:'living' },
      { name: "其他", value: 'general' },
    ],

    // 大类参数
    largeList:[
      { name:'全部',value:'' },
      { name:'摄影',value:'photography' },
      { name:'其他',value:'general' }
    ],

    // 配置项
    setting:{
      order:{ index: "D", name: "最新", value: "date" },
      paperValue:'/timeline/v3',
      score: 99999999,
      no: 99999999,
      dateTime: (new Date().getFullYear())+(new Date().getMonth() + 1).toString().padStart(2, '0')+ ( new Date().getDate().toString().padStart(2, '0')) ,
      cateWhat:'',
      cateHow:'',
    },
   },
   currentID:null,
 }),

 actions:{
    
 },

 persist: {
  enabled: true,
  strategies: [
    {
      paths: ['pickParams','currentID'],
      storage: dbStorage,
    },
  ],
 },

})