import { defineStore } from "pinia";
import axios from "axios";
import dbStorage from "./dbStorage";

export const newsStore = defineStore('news', {
  state: () => ({
    NewsMsgList: [],
  }),
  actions: {
    /**
     * @param {string} tag 
     * @param {number} num 
     * @returns {array} 
     */
    async getNewsMsg(tag, num) {
      try {
        const response = await axios.get('http://v.juhe.cn/toutiao/index', {
          params: {
            key: '2ce91c43301c9528f2f9d1cd6f310e2b',
            tag: tag,
            page_size: num,
          }
        });

        if (response.data.reason === 'success') {
          this.NewsMsgList = response.data.result.data;
          return this.NewsMsgList;
        }
      } catch (error) {
        throw new Error(error);
      }
      
      return []; 
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
