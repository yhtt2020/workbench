import {defineStore} from "pinia";
import dbStorage from "./dbStorage";
import {compareTime, randomData, sendRequest} from '../js/axios/api'

// @ts-ignore
export const steamStore = defineStore("steam", {
  state: () => ({
    steamCC: {id: "cc", name: '国区'},
    data: [],
    dataDetail: {}, // 应用详情
    weekList: [],
    nextWeekLits: []
  }),
  actions: {
    getRandomList(list) {
      const randomArr = randomData(list, 4)
      return randomArr
    },
    async getData(cc) {
      if (typeof this.data !== 'object') {
        this.data = {}
      }


      //命中缓存
      const discountList = this.data[cc]
      if (discountList) {
        if (!compareTime(discountList.expiresDate)) {   // 将对象里面的时间进行判断是否大于12小时
          console.log('命中缓存了')
          console.log(this.data)
          //无需做任何操作
          return
        }
      }

      let res = await sendRequest(`https://store.steampowered.com/api/featuredcategories/?cc=${cc}&l=${cc}`,{})
      if (res && res.headers) {
        const date = new Date(res.headers.expires)
        const requestObj = {
          cc: cc,
          expiresDate: date,
          list: res.data.specials.items
        }
        this.updateGameData(cc, requestObj)
      }


    },
    // 根据编码分类列表数据存储
    setGameData(value) {
      const findIndex = this.data.findIndex(el => {
        return el.cc === value.cc
      })
      if (findIndex === -1) {
        this.data.push(value)
        localStorage.setItem("gameData", JSON.stringify(this.data))
        const getGame = localStorage.getItem("gameData")
        if (getGame) {
          this.data = JSON.parse(getGame)
        }
      } else {
        return
      }
    },
    // 详情数据存储
    setGameDetail(value) {
      this.dataDetail = value
      localStorage.setItem("detail", JSON.stringify(this.dataDetail))
      const getDetail = localStorage.getItem("detail")
      if (getDetail) {
        this.dataDetail = JSON.parse(getDetail)
      }
    },
    // 通过时间更新数据
    updateGameData(cc, value) {
      console.log('更新数据=', value)
      this.data[cc] = value
    },
  },
  persist: {
    enabled: true,
    strategies: [
      {
        // 自定义存储的 key，默认是 store.$id
        // 可以指定任何 extends Storage 的实例，默认是 sessionStorage
        storage: dbStorage,
        // state 中的字段名，按组打包储存
      },
      {
        // 自定义存储的 key，默认是 store.$id
        // 可以指定任何 extends Storage 的实例，默认是 sessionStorage
        storage: localStorage,
        paths: ['data']
        // state 中的字段名，按组打包储存
      },
    ],
  },
});
