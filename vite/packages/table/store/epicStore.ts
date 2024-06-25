import { defineStore } from "pinia";
import dbStorage from "./dbStorage";
import { quickRequest } from "../js/axios/api";
import { serverCache } from "../js/axios/serverCache";
import axios from "axios";

const url = `https://store-site-backend-static-ipv4.ak.epicgames.com/freeGamesPromotions?locale=zh-CN&country=CN&allowCountries=CN`;

// @ts-ignore
export const epicStore = defineStore("epic", {
  state: () => ({
    epicData: {
      promotionalList: [],
      upcomingList: [],
    },
  }),

  actions: {
    async getEpicData(cache = 1) {
      let result: any = null;
      let serverCacheTtl = 60 * 10;
      if (cache) {
        result = await quickRequest(
          url,
          {},
          {
            localCache: true,
            localTtl: 60 * 10,
          }
        );
      } else {
        //强制刷新，直接获取并设置服务器缓存
        let axiosResponse = await axios.get(url, {});
        if (axiosResponse.status === 200) {
          // 如果请求到数据，post到serverCache的setCache api
          await serverCache.set(url, axiosResponse, serverCacheTtl).then();
        }
      }

      try {
        const { Catalog } = result?.data?.data;
        const { elements } = Catalog?.searchStore;

        // 排除promotions.promotionalOffers的列表不是空列表
        const filterEl = elements?.filter((el: any) => {
          return el?.promotions !== null;
        });

        // 促销优惠
        this.epicData.promotionalList = filterEl.filter((el: any) => {
          return el?.promotions?.promotionalOffers?.length !== 0;
        });

        // 即将推出的促销优惠
        this.epicData.upcomingList = filterEl.filter((el: any) => {
          return el?.promotions?.upcomingPromotionalOffers?.length !== 0;
        });
      } catch (error) {
        console.error("网络或者其他因素出错了", error);
      }
    },

    // 刷新更新数据
    refresh() {
      serverCache.removeLocalCache(url);
      this.getEpicData(0);
    },
  },

  persist: {
    enabled: true,
    strategies: [
      {
        // 自定义存储的 key，默认是 store.$id
        // 可以指定任何 extends Storage 的实例，默认是 sessionStorage
        storage: localStorage,
        paths: ["epicData"],
        // state 中的字段名，按组打包储存
      },
    ],
  },
});
