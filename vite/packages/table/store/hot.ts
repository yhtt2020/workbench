import {defineStore} from "pinia";
import dbStorage from "./dbStorage";
import {compareTime, cacheRequest, quickRequest} from '../js/axios/api'
import cheerio from 'cheerio';
import {serverCache} from "../js/axios/serverCache";

const url = `https://tophub.today/n/KqndgxeLl9`
// @ts-ignore
export const hotStore = defineStore("hot", {
  state: () => ({
    data: {}
  }),
  actions: {
    async getData() {

      // if (typeof this.data !== 'object') {
      //     this.data = {}
      // }
      // const discountList = this.data
      // if (discountList.hotList?.length) {
      //     if (!compareTime(discountList.expiresDate)) {   // 将对象里面的时间进行判断是否大于12小时
      //       // console.log('命中缓存了')
      //       return
      //     }
      // }

      let res = await quickRequest(url, {}, {
        localCache: true,
        localTtl: 60 * 10
      })
      let hotList = []
      const html = res.data
      const dom = cheerio.load(html)
      console.log(dom,'搜索到的dom')
      dom('.Zd-p-Sc .cc-dc:first-child tbody').children().each((i, el) => {
        let id = dom(el).children().eq(0).text()
        id = id?.split('.')[0]
        let title = dom(el).children().children().eq(0).text()
        let heat = dom(el).children().eq(2).text()
        hotList.push({id, title, heat})
        console.log({id, title, heat},'jieguo')
      })

      this.data = hotList
      // const date = new Date()
      // const requestObj = {
      //     expiresDate: date,
      //     hotList
      // }
      // this.updateData(requestObj)
    },
    //  通过时间更新数据
    // updateData( value) {
    //     this.data = value
    // },
    refresh() {
      serverCache.removeLocalCache(url)
      this.getData()
    }

  },
  persist: {
    enabled: true,
    strategies: [
      {
        // 自定义存储的 key，默认是 store.$id
        // 可以指定任何 extends Storage 的实例，默认是 sessionStorage
        storage: dbStorage,
        paths: ['data']
        // state 中的字段名，按组打包储存
      },
    ],
  },
});
