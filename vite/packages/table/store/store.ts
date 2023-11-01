import {defineStore} from "pinia";
import dbStorage from "./dbStorage";
import {sUrl} from "../consts";
import {get} from "../js/axios/request";
import {localCache} from '../js/axios/serverCache'
import axios from "axios";
const juheGet = sUrl('/app/juhe/get')
const https=require('https')
// 跳过检验证书
const agent=new https.Agent({
    rejectUnauthorized:false
})

// @ts-ignore
export const oilStore = defineStore("OilPrices", {
    state: () => ({
        cityOilData:[],
        currentCity:[],
        cityOilList:[],
    }),
    actions:{
        // 获取目标省市的油价
        cityOil(city){
            this.getCityOilData()
            // this.cityOilList=[]
            // this.cityOilList.length=0
            let  data= this.cityOilData.filter((item)=>{
                return item.city==city
            })
            this.cityOilList=data
            // console.log('city2',data);
            // console.log('city1',this.cityOilList);
            
            
            return this.cityOilList
        },

        // 获取中国所有省份的油价
        async getCityOilData(){
            if(localCache.get('cityOilData')){
                this.cityOilData=localCache.get('cityOilData')
                // console.log(this.cityOilData);
                return
            }
            let res=await get(juheGet,{
                apiName:'gnyj.query',
                params:{
                },
                options:{
                    key:'toutiao.gnyj.query',
                    ttl:60*60*12,
                    cache:1,
                }
            })
            // console.log(res);
            
            if(res.status){
                if(res.data instanceof Array){
                    this.cityOilData=res.data
                }else{
                    this.cityOilData = res.data.result.data
                }
                localCache.set('cityOilData',this.cityOilData,60*60*12)
            }
            else{
                return false
            }
        },
        // 根据ip获取当前的省份
        async getCity(){
            let res=await axios.get('https://api.vore.top/api/IPdata',{httpsAgent:agent})
            // console.log('getcity',res.data.adcode);
            if(res.status==200){
                // console.log(res.data.adcode.p);
                this.currentCity=res.data.adcode
                // console.log(this.currentCity);
                
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