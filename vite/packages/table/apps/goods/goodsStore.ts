import {defineStore} from "pinia";
import {apiGet,apiPost} from "../../js/axios/request";
import dbStorage from "../../store/dbStorage";

export const goodsStore = defineStore('goodsStore', {
  state: () => ({
    myPromoGoods:[],
    myPromoKeywords:[]
  }),
  actions:{
    searchGoods(keyword){
      return apiGet('/app/ad/pdd/search',{
        keyword:keyword
      })
    },
    getDetail(goodsSign){
      return apiPost('/app/ad/pdd/getGoodsDetail',{
        goods_sign:goodsSign
      })
    },
    generateUrl(goodsSign,shortUrl=true,params={}){
      return apiPost('/app/ad/pdd/generateUrl',{
        goods_sign_list:JSON.stringify(goodsSign),
        generate_short_url:shortUrl,
        custom_parameters:JSON.stringify(params)
      })
    }
  },
  persist: {
    enabled: true,
    strategies: [
      {
        // 自定义存储的 key，默认是 store.$id
        // 可以指定任何 extends Storage 的实例，默认是 sessionStorage
        storage: localStorage,
        // state 中的字段名，按组打包储存
      },
    ],
  }
})
