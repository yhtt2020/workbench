import { defineStore } from 'pinia';
import { sUrl } from '../consts'
import {getConfig} from "../js/axios/serverApi";
import dbStorage from "./dbStorage";
import _ from 'lodash-es';
import axios from 'axios';
// import {message} from "ant-design-vue";
import cache from '../components/card/hooks/cache'
import {post,get} from "../js/axios/request";

const getFrameUrl = sUrl('/app/good/frame/list')  // 获取头像商品数据
const editInfoUrl = sUrl('/app/com/updateUserInfo') // 修改文档信息
const ensureOrderUrl=sUrl('/app/order/ensure')
const getQrcodeUrl=sUrl('/app/order/getQrcode')
const getMyFramesUrl=sUrl('/app/good/frame/my')
const checkOrderPaidUrl=sUrl('/app/order/checkOrderPaid')



const equipFrameUrl=sUrl('/app/good/frame/equip')
//@ts-ignore
export const frameStore = defineStore('frameStore',{
  state:()=>({
    frameData:{
      list:[]
    },
  }),

  actions:{
    /**
     * 获得头像商品
     */
    async getFrameGoods(){   // 获取头像框商品数据
      const result = await get(getFrameUrl)
      this.frameData.list = result
    },
    async updateMyinfo(data){  // 修改我的信息
      return  await post(editInfoUrl,data)
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
      const result = await post(ensureOrderUrl, {
        goodNanoid,
        priceNanoid
      })
      if(result){
        return result.data
      }
    },
    /**
     * 获得支付二维码
     * @param orderNanoid
     * @param payment
     */
    async getQrcode(orderNanoid,payment){
      const result = await post(getQrcodeUrl, {
        nanoid:orderNanoid,
        payment:payment
      } )
      if(result.data){
        return result.data
      }
    },

    async getMyFrames(){
      console.log(getMyFramesUrl,'获取地址')
      const result=await get(getMyFramesUrl)

      if(result.data){
        return result.data
      }
    },
    /**
     * 装备上头像框
     * @param itemNanoid
     */
    async equipFrame(itemNanoid){
      return post(equipFrameUrl,{
        itemNanoid:itemNanoid
      })
    },

    /**
     * 检查订单支付状态，一旦支付成功，自动完成发放业务
     * @param orderNanoid
     */
    async checkOrderPaid(orderNanoid){
      return post(checkOrderPaidUrl,{
        nanoid:orderNanoid
      })
    }
  }

})
