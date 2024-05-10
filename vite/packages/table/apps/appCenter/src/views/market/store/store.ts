import { defineStore } from "pinia";
import { get, post } from "../../../../../../js/axios/request";
import { sUrl } from "../../../../../../consts";
import { appHelper } from '../hooks/appHelper'
import { getConfig } from "../../../../../../js/axios/serverApi";
const ad = sUrl('/app/good/getGoodAdv')
const download = sUrl('/app/good/app/downloadCount')
// getGoodAdv:'/app/good/getGoodAdv'
export const useMarketStore = defineStore("useMarketStore", {
    state: () => ({
        recommendUrl:'/app/good/getGoodRecommend',
        recommendList: [],
        adList: [],
    }),
    getters: {},
    actions: {
        async getRecommendList() {
            const url = sUrl(this.recommendUrl)
            const res = await post(url)
            // console.log(res[0].children[0], 'res')
            let list = res[0].children.map((item) =>{
                const arr = item.goods.map((item)=> {
                    return this.resetGoodsType(item)
                })
                // console.log(arr)
                return arr
            })
            list = list.flat()
            this.recommendList = list
        },
        async getAd() {
            const res = await post(ad)
            const list = res.map(item => this.resetAdType(item))
            this.adList = list
            // console.log(res,list,'ad')
        },
        resetAdType(data) {
            return {
                img:data.img1,
                url:data.link2
            }
        },
        resetGoodsType(data){
            return {
                id:data.dataNanoid,
                name:data.good.alias,
                icon:data.good.cover,
                summary:data.good.summary,
                value:data.good.data,
                type:'lightApp',
            }
        },
        async downloadCount(id) {
            const res = await post(download,{id})
            console.log(res)
        }
    },
})