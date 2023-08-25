import { defineStore } from "pinia";
import axios from "axios";
import dbStorage from "./dbStorage";

export const newsStore = defineStore("news", {
  state: () => ({
    NewsMsgList: [],
  }),
  actions: {
    async getNewsMsg(tag, num) {
        let response = await axios.get("http://v.juhe.cn/toutiao/index", {
          params: {
            type: tag,
            page_size: num,
            key: "2ce91c43301c9528f2f9d1cd6f310e2b",
          },
        });
        // console.log(response);

        if(response.status==200){
          this.NewsMsgList=response.data.result.data
          console.log(this.NewsMsgList);
          
        }
      
    },
    
  },
  persist: {
    enabled: true,
    strategies: [
      {
        storage: dbStorage,
        paths: ['NewsMsgList'],
      }
    ]
  }
});
