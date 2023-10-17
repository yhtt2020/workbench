import {get, post} from '../js/axios/request'
import {sUrl} from '../consts'
import {defineStore} from "pinia";


const api = {
  getCategories: sUrl('/app/category/list'),
  addDesk: sUrl('/app/good/desk/add'),
  getDesks: sUrl('/app/good/desk/page'),
  getRecommend:sUrl('/app/good/getGoodRecommend'),
  incSupport:sUrl('/app/good/incSupport'),
  incCount:sUrl('/app/good/incCount')
}


export const marketStore = defineStore('marketStore', {
  state: () => ({}),
  actions: {
    getCategories(goodType, subType) {
      return post(api.getCategories, {
        goodType: goodType,
        subType: subType
      })
    },
    addDesk(desk) {
      return post(api.addDesk, {
        ...desk
      }, {crud: true})
    },
    getDesks(params) {
      return post(api.getDesks, {
          ...params
        },
        {
          crud: true
        })
    },
    async getRecommend(params) {
      let result = await post(api.getRecommend, {
        ...params
      })
      if (result) {
        let recommendList=[]
        result?.forEach(item=>{
          return item.children.forEach(ch=>{
            ch.goods.forEach(good=>{
              recommendList.push(good.good)
            })

          })
        })
        return recommendList
      }
    },

    /**
     * 增加商品统计数
     * @param dataNanoid
     */
    async incCount(dataNanoid){
      return await post(api.incCount,{dataNanoid:dataNanoid})
    },

    /**
     * 增加点赞数
     * @param dataNanoid
     */
    async incSupport(dataNanoid){
      return await post(api.incSupport,{dataNanoid:dataNanoid})
    }
  }
})
