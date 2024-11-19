import { defineStore } from "pinia";
// import dbStorage from "../../../store/dbStorage";

// @ts-ignore
export const pickPaperStore = defineStore("pickPaper", {
  state:()=>({
    /**当前左侧列表选择下标**/
    currentID:'m',

    /**壁纸接口类型配置**/
    paperApi:'timeline',

    /**拾光壁纸排序**/
    orderValue:'date',

    /**大类默认参数**/
    cateHowValue:'',

    /**子类默认参数**/
    cateWhatValue:'',

    /**壁纸源昵称和简介**/
    paperNick:{
      name:'',
      synopsis:'',
    }, 

  }),

  actions:{},

  persist: {
    enabled: true,
    strategies: [
      {
        paths: ['paperApi','currentID','orderValue','cateHowValue','cateWhatValue','paperNick',],
        storage: localStorage,
      },
    ],
   },
});
