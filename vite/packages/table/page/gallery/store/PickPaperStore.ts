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
      { name: '贪吃蛇', value: '/snake/v2', synopsis: '暂无简介' },
      { name: 'wallhaven', value: '/wallhaven/v2', synopsis: 'The best wallpapers on the Net' }
    ],
    paperList:[],
    wallhavenList:[],

    setting:{
      tabValue:'date',
      paperValue:'/timeline/v2',
      score: 99999999,
      no: 99999999,
      dateTime: 20500101,
    },

   

   },
 }),

 actions:{
    // 获取拾光壁纸分类
    getPickLightClass(){
      axios.get(pickLightUrl)
      .then((res:any)=>{
        if(res.status === 200){
          const dataList = res.data.data;
          const mapDataList = dataList.map((item:any)=>{
            return{ ...item,  value:item.id, };
          })
          this.paperList = mapDataList;
        }
      })
      .catch((error:any)=>{ console.error(error) })
      .finally(()=>{})
    },

    // 获取wallheaven壁纸分类
    getWallHeavenClass(){
      axios.get(wallheavenUrl)
      .then((res:any)=>{
        if(res.status === 200){
          const dataList = res.data.data;
          const list = [];
          const nameList = [{ name:'Anime',alias:'动漫精选' },{name:'General',alias:'热门精选'},{name:'People',alias:'人物精选'},];
          for(const item of dataList){
            const index = list.findIndex((find:any)=>{ return String(find.id) === String(item.id) });
            const nameIndex = nameList.findIndex((find)=>{ return find.name === item.name });
            if(index === -1){
              const updateItem = {
                version:item.version,
                id:item.id,
                value:item.id,
                name:nameList[nameIndex].alias,
                alias:nameList[nameIndex].name,
              }
              list.push(updateItem as never);
            } 
          }
          this.wallhavenList = list;
        }
      })
      .catch((error:any)=>{ console.error(error);})
      .finally(()=>{})
    },


 },

 persist: {
  enabled: true,
  strategies: [
    {
      paths: ['pickParams'],
      storage: localStorage,
    },
  ],
 },

})