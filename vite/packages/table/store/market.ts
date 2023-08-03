import {get, post} from '../js/axios/request'
import {sUrl} from '../consts'
import {defineStore} from "pinia";


const api = {
  getCategories: sUrl('/app/category/list'),
  addDesk: sUrl('/app/good/desk/add'),
  getDesks: sUrl('/app/good/desk/page'),
  getRecommend:sUrl('/app/good/getGoodRecommend')
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
            console.log(ch)
            ch.goods.forEach(good=>{
              recommendList.push(good.good)
            })

          })
        })
        return recommendList
      }
    },

  }
})
