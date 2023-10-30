import {defineStore} from "pinia";
import dbStorage from "./dbStorage";
import {sUrl} from "../consts";
import {post} from "../js/axios/request";
import {localCache} from '../js/axios/serverCache'
const kdniao=sUrl('/app/kdniao/realTimeQuery')

export const courierStore = defineStore("courier", {
    state: () => ({
        courierMsgList: [],
    }),
    actions: {
        async getCourierMsg(shipperCode='',logisticCode,customerName='') {
            const cacheTag='kdniao:cache:'+shipperCode+logisticCode
            const cacheData=localCache.get(cacheTag)
            if(cacheData){
                this.courierMsgList = cacheData
                console.log(this.courierMsgList);
            }
            let response = await post(kdniao, {
                shipperCode,
                logisticCode,
                customerName
            })
            console.log(response,'response');
            
            if (response.status) {
                this.courierMsgList = response.data
            }
            console.log(this.courierMsgList,'this.courierMsgList');
            
            localCache.set(cacheTag,this.courierMsgList,24*60*60)
        },
    },
    persist: {
        enabled: true,
        strategies: [
            {
                storage: dbStorage,
                paths: ['courierMsgList'],
            }
        ]
    }
})