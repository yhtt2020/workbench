import {defineStore} from "pinia";
import dbStorage from "./dbStorage";
import {compareTime, randomData, sendRequest} from '../js/axios/api'

// @ts-ignore
export const steamStore = defineStore("steam", {
  state: () => ({
    steamCC: {id: "cc", name: '国区'},
    data: {},
    dataDetail: {}, // 应用详情
    weekList: [],
    nextWeekLits: [],
    discountDetail:{}, // 游戏助手折扣推荐详情
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

      let res = await sendRequest(`https://store.steampowered.com/api/featuredcategories/?cc=${cc}&l=${cc}`,{},{
        localCache:true,
        localTtl:12*60*60
      })
      if (res && res.headers) {
        const date = new Date(res.headers.expires)
        const requestObj = {
          cc: cc,
          expiresDate: date,
          list: res.data.specials.items
        }
        this.updateGameData(cc, requestObj)
      }else{
        this.updateGameData(cc,{})
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

    // 获取折扣推荐详情数据
    async getDiscountDetail(id:number,v:string){
      const url = `https://store.steampowered.com/api/appdetails?appids=${id}&cc=${v}&l=${v}`
      const result = await sendRequest(url,{},{localCache:true,localTtl:60*12*60})
      const res = result.data[id].data
      const newLanguages = res.supported_languages.replaceAll('<strong>*</strong>','') // 将语言中的strong标签去除
      this.discountDetail.name = res.name
      this.discountDetail.content = res.short_description
      if(res.movies){
        this.discountDetail.movie_image = res.movies.concat(res.screenshots)
      }else{
        this.discountDetail.movie_image=res.screenshots
      }

      this.discountDetail.IssueDate = res.release_date.date
      this.discountDetail.developers = res.developers[0]
      this.discountDetail.language = newLanguages.split('<br>')[0]
      this.discountDetail.publisher = res.publishers[0]
      this.discountDetail.genres = res.genres
      this.discountDetail.percent = res.price_overview.discount_percent
      this.discountDetail.newPrice = res.price_overview.final_formatted
      this.discountDetail.gameIntroduction = res.detailed_description
      // console.log('命中更新',this.discountDetail.movie_image);
    },

  },
  // persist: {
  //   enabled: true,
  //   // strategies: [
  //   //   {
  //   //     // 自定义存储的 key，默认是 store.$id
  //   //     // 可以指定任何 extends Storage 的实例，默认是 sessionStorage
  //   //     storage: dbStorage,
  //   //     // state 中的字段名，按组打包储存
  //   //   },
  //   //   // {
  //   //   //   // 自定义存储的 key，默认是 store.$id
  //   //   //   // 可以指定任何 extends Storage 的实例，默认是 sessionStorage
  //   //   //   storage: localStorage,
  //   //   //   paths: []
  //   //   //   // state 中的字段名，按组打包储存
  //   //   // },
  //   // ],
  // },
});
