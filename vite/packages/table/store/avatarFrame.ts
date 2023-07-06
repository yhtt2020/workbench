import { defineStore } from 'pinia';
import { sUrl } from '../consts'
import {getConfig} from "../js/axios/serverApi";
import dbStorage from "./dbStorage";
import _ from 'lodash-es';
import axios from 'axios';

 
const getFrameUrl = sUrl('/app/good/frame/list')  // 获取头像商品数据


//@ts-ignore
export const frameStore = defineStore('frameStore',{
  state:()=>({
    frameData:{},
    
  }),

  actions:{
    async getFrameGoods(){   // 获取头像框商品数据
      const result = await axios.get(getFrameUrl, { params:{},...await getConfig() })
      if(result.data.code === 1000){
        this.frameData.list = result.data.data
      }
    }
  },

})