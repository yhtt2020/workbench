import {defineStore} from "pinia";
import dbStorage from "./dbStorage";
import {sUrl} from "../consts";
import {post} from "../js/axios/kdniaoPost";
import {localCache} from '../js/axios/serverCache'

const kdniao = sUrl('/app/kdniao/realTimeQuery')

export const courierStore = defineStore("courier", {
    state: () => ({
      storeInfo: {
        jd:{
          nickname:null,
          order:{
            orders:[],
            parentOrders:[]
          }
        }
      },
        courierMsgList: [],
        courierDetailList: [

            {
                shipperCode:'ZTO',
                logisticCode:'78376829849713',
                customerName:''
            },
            {
                shipperCode:'SF',
                logisticCode:'SF1672404324049',
                customerName:'6654'
            }
        ],
        couriersDetailMsg:[]
    }),
    actions: {
        async getCourierMsg(shipperCode,logisticCode,customerName='') {
            const cacheTag='kdniao:cache:'+shipperCode+logisticCode
            const cacheData=localCache.get(cacheTag)
            if(cacheData){
                this.courierMsgList = cacheData
                // console.log(this.courierMsgList);
            }
            let response = await post(kdniao, {
                shipperCode,
                logisticCode,
                customerName
            })
            // console.log(response,'response');

            if (response.Success) {
                this.courierMsgList = response
            }
            // console.log(this.courierMsgList,'this.courierMsgList');

            localCache.set(cacheTag,this.courierMsgList,24*60*60)
            return this.courierMsgList
        },
        // addCourierEvent(event){
        //     this.courierDetailList.push(event)
        // },
        // removeCourierEvent(event){
        //     this.courierDetailList=this.courierDetailList.filter(item=>{
        //         return item.shipperCode!=event.shipperCode && item.logisticCode!=event.logisticCode
        //     })
        // },
        getCouriersDetail(){
            this.couriersDetailMsg=Promise.all(this.courierDetailList.map( (item) => {
                let res =  this.getCourierMsg(item.shipperCode, item.logisticCode, item.customerName);
                return res;
            }));
            // console.log(this.couriersDetailMsg,'couriersDetailMsg');
        }

  },
  persist: {
    enabled: true,
    strategies: [
      {
        storage: dbStorage,
        paths: ['courierMsgList','storeInfo'],
      }
    ]
  }
})
