import { defineStore } from 'pinia';
import { sUrl } from '../consts'
import {getConfig} from "../js/axios/serverApi";
import dbStorage from "./dbStorage";
import _ from 'lodash-es';
import axios from 'axios';
import {message} from "ant-design-vue";
import cache from '../components/card/hooks/cache'


const getFrameUrl = sUrl('/app/good/frame/list')  // 获取头像商品数据
const editInfoUrl = sUrl('/app/com/updateUserInfo') // 修改文档信息
const ensureOrderUrl=sUrl('/app/order/ensure')
const getQrcodeUrl=sUrl('/app/order/getQrcode')
const getMyFramesUrl=sUrl('/app/good/frame/my')
//@ts-ignore
export const frameStore = defineStore('frameStore',{
  state:()=>({
    frameData:{},
  }),

  actions:{
    /**
     * 获得头像商品
     */
    async getFrameGoods(){   // 获取头像框商品数据
      const result = await axios.get(getFrameUrl, { params:{},...await getConfig() })
      if(result.data.code === 1000){
        this.frameData.list = result.data.data
      }
    },
    async updateMyinfo(data){  // 修改我的信息
      console.log('测试',data.nickname.length);
      const updateMyInfoResult = await axios.post(editInfoUrl,data,await getConfig())
      if(updateMyInfoResult.data.data.msg === 'ok' ){
        message.success('修改成功')
      }
    },
    saveAvatarUrl(){ // 将返回的图片路径进行缓存
      this.frameData.avatar_url =  cache.get('avatar_url')
    }
    ,
    /**
     * 确认订单，如果这个商品的这个价格还没有订单，则自动给你生成一个订单，否则就返回未支付订单，防止反复创建订单
     * @param goodNanoid
     * @param priceNanoid
     */
    async ensureOrder(goodNanoid,priceNanoid){
      console.log(goodNanoid,priceNanoid)
      const result = await axios.post(ensureOrderUrl, {
        goodNanoid,
        priceNanoid
      },await getConfig() )
      if(result.data.code === 1000){
        return result.data.data
      }
    },
    /**
     * 获得支付二维码
     * @param orderNanoid
     * @param payment
     */
    async getQrcode(orderNanoid,payment){
      const result = await axios.post(getQrcodeUrl, {
        nanoid:orderNanoid,
        payment:payment
      },await getConfig() )
      if(result.data.code === 1000){
        return result.data.data
      }
    },

    async getMyFrames(){
      console.log(getMyFramesUrl,'获取地址')
      const result=await axios.get(getMyFramesUrl,{
        params:{},
        ...await getConfig()
      })

      if(result.data.code===1000){
        return result.data.data
      }
    }
  }

})
