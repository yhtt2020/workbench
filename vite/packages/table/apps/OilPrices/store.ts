import {defineStore} from "pinia";
import dbStorage from "../../store/dbStorage";
import {sUrl} from "../../consts";
import {get} from "../../js/axios/request";
import {localCache} from '../../js/axios/serverCache'
import axios from "axios";
const juheGet = sUrl('/app/juhe/get')


export const oilStore = defineStore("OilPrices", {
    state: () => ({
        cityOilData:[],
        currentCity:{}

    }),
    actions:{

        // 获取中国所有省份的油价
        async getCityOilData(){
            if(localCache.get('cityOilData')){
                this.cityOilData=localCache.get('cityOilData')
                return
            }
            let res=await get(juheGet,{
                apiName:'gnyj.query',
                params:{
                },
                options:{
                    key:'toutiao.gnyj.query',
                    ttl:60*60*24,
                    cache:1,
                }
            })
            console.log(res);
            
            if(res.status){
                if(res.data instanceof Array){
                    this.cityOilData=res.data
                }else{
                    this.cityOilData = res.data.result.data
                }
                localCache.set('cityOilData',this.cityOilData,60*60*24)
            }
            else{
                return false
            }
        },
        // 根据ip获取当前的省份
        async getCity(){
            let res=await axios.get('https://api.vore.top/api/IPdata')
            if(res.code==200){
                console.log(res);
                
                this.currentCity=res.adcode || []
            }
        }

    },
    persist: {
        enabled: true,
        strategies: [
          {
            storage: dbStorage,
            paths: ['cityOilData','currentCity'],
          }
        ]
      }
})