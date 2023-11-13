import { defineStore } from "pinia";
import dbStorage from "./dbStorage";
import { compareTime, cacheRequest, quickRequest } from "../js/axios/api";
import { serverCache } from "../js/axios/serverCache";
import axios from "axios";
import { thisWeek,nextWeek,remainderDays} from "../components/widgets/games/utils/epicUtils";

const url = `https://store-site-backend-static-ipv4.ak.epicgames.com/freeGamesPromotions?locale=zh-CN&country=CN&allowCountries=CN`;

// @ts-ignore
export const epicStore = defineStore("epic", {
  state: () => ({
    epicData: {},
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
        // console.log('查看刷新结果',axiosResponse);
        
        if (axiosResponse.status === 200) {
          // 如果请求到数据，post到serverCache的setCache api
          await serverCache.set(url, axiosResponse, serverCacheTtl).then();
        }
      }

      try {
        // console.log("获取result", result);
        if (result !== null) {
          const data = result.data.data.Catalog;
          const epicList = data.searchStore.elements;
          // 过滤掉为null的数据
          const filterEpic = epicList.filter((item) => {
            return item.promotions !== null;
          });
          // 排除promotions.promotionalOffers的列表不是空列表
          const mapPromo = filterEpic.map((item) => {
            if (item.promotions.promotionalOffers.length !== 0) {
              return {
                title: item.title,
                summary: item.description,
                keyImages: item.keyImages,
                price: item.price,
                promotions: {
                  ...item.promotions.promotionalOffers[0].promotionalOffers[0],
                },
              };
            }
          });
          // 排除promotions.upcomingPromotionalOffers的列表不是空列表
          const mapUnPromo = filterEpic.map((item) => {
            if (item.promotions.upcomingPromotionalOffers.length !== 0) {
              return {
                title: item.title,
                summary: item.description,
                keyImages: item.keyImages,
                price: item.price,
                promotions: {
                  ...item.promotions.upcomingPromotionalOffers[0]
                    .promotionalOffers[0],
                },
              };
            }
          });
          // 将promotions.promotionalOffers被排除后的列表中有undefined的值进行过滤
          const filterPromo = mapPromo.filter((item) => {
            return item !== undefined;
          });
          // 将promotions.upcomingPromotionalOffers被排除后的列表中有undefined的值进行过滤
          const filterUnPromo = mapUnPromo.filter((item) => {
            return item !== undefined;
          });
          /**
           * 将promotions.promotionalOffers和promotions.upcomingPromotionalOffers的列表
           * 进行合并,然后根据startDate和endDate进行本周和下周的区分
           * **/
          const newPromoList = filterPromo.concat(filterUnPromo);
          const thisWeekDate = thisWeek();
          const nextWeekDate = nextWeek();
          // 根据promoList和unPromoList中的startDate和endDate来判断属于本周还是下一周的数据
          const thisWeekList = newPromoList.filter((item) => {
            if (
              item.promotions.startDate !== null &&
              item.promotions.endDate !== null
            ) {
              const startDate = new Date(item.promotions.startDate);
              const endDate = new Date(item.promotions.endDate);
              return (
                startDate <= thisWeekDate.endDate &&
                endDate >= thisWeekDate.startDate
              );
            }
          });
          const nextWeekList = newPromoList.filter((item) => {
            const itemNull =
              item.promotions.startDate !== null &&
              item.promotions.endDate !== null;
            if (itemNull) {
              const nextStartDate = new Date(item.promotions.startDate);
              const nextEndDate = new Date(item.promotions.endDate);
              return (
                nextStartDate <= nextWeekDate.endDate &&
                nextEndDate >= nextWeekDate.startDate
              );
            }
          });

          const thisWeekListMap = thisWeekList.map((item) => {
            return {
              ...item,
              days: remainderDays(item.promotions),
            };
          });

          const nextWeekListMap = nextWeekList.map((item) => {
            return { ...item, days: remainderDays(item.promotions) };
          });
          // console.log('本周免费',thisWeekListMap);
          // console.log('下周预告',nextWeekListMap);
          this.epicData.promotionList = thisWeekListMap.slice(0, 2);
          this.epicData.unPromotionList = nextWeekListMap;
        }
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

  // persist: {
  //   enabled: true,
  //   strategies: [
  //     {
  //       // 自定义存储的 key，默认是 store.$id
  //       // 可以指定任何 extends Storage 的实例，默认是 sessionStorage
  //       storage: dbStorage,
  //       paths: ["epicData"],
  //       // state 中的字段名，按组打包储存
  //     },
  //   ],
  // },
});
