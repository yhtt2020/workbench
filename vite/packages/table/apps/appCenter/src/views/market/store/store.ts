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
        // 获取推荐应用
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
        // 获取广告位
        async getAd() {
            const res = await post(ad)
            const list = res.map(item => this.resetAdType(item))
            this.adList = list
            // console.log(res,list,'ad')
        },
        // 重置图片
        resetAdType(data) {
            return {
                img:data.img1,
                url:data.link1
            }
        },
        // 重置格式
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
        // 下载次数
        async downloadCount(id) {
            const res = await post(download,{id})
            console.log(res)
        }
    },
    persist: {
        enabled: true,
        strategies: [
            {
                paths: ['recommendList', 'adList'],
                storage: localStorage,
            },
        ],
    }
})