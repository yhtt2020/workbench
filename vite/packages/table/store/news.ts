import { defineStore } from "pinia";
import axios from "axios";
import dbStorage from "./dbStorage";

export const newsStore = defineStore("news", {
  state: () => ({
    // categoryList: [],
    NewsMsgList:[]
  }),
  actions: {
    // 添加标签
    // async getCategory() {
    //   let id = 0;
    //   let res = await axios.get("http://v.juhe.cn/toutiao/index", {
    //     params: {
    //       key: "2ce91c43301c9528f2f9d1cd6f310e2b",
    //     },
    //   });
    //   if (res.reason === "success") {
    //     this.categoryList = res.result.data.category.map(() => {
    //       return {
    //         title: res.result.data.category,
    //         id: id++,
    //       };
    //     });
    //   }
    // },
    // 获取新闻数据
    async getNewsMsg(tag){
      let res=await axios.get('http://v.juhe.cn/toutiao/index',{
        params:{
          key:'2ce91c43301c9528f2f9d1cd6f310e2b',
          type:tag,
          page_size:10
        }
      })
      if(res.reason==='success'){
        this.NewsMsgList= res.result.data
      }
    }
  },
  persist: {
    enabled: true,
    strategies: [{
      // 自定义存储的 key，默认是 store.$id
      // 可以指定任何 extends Storage 的实例，默认是 sessionStorage
      storage: dbStorage,
      // state 中的字段名，按组打包储存
      paths:['newsCard']
    }]
  }
});
