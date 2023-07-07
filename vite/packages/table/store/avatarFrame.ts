import { defineStore } from 'pinia';
import { sUrl } from '../consts'
import {getConfig} from "../js/axios/serverApi";
import dbStorage from "./dbStorage";
import _ from 'lodash-es';
import axios from 'axios';

 
const getFrameUrl = sUrl('/app/good/frame/list')  // 获取头像商品数据
const editInfoUrl = sUrl('/app/com/updateUserInfo') // 修改文档信息
// const uploadImgUrl = sUrl('/app/cosUpload')  // 上传图片

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
    },
    async updateMyinfo(data){  // 修改我的信息  
      console.log('修改我的信息>>>>',data.nickname);
      console.log('修改我的信息>>>>',data.sex);
      console.log('修改我的信息>>>>',data.signature);
      // const updateMyInfoResult = await axios.post(editInfoUrl,{},await getConfig())
    },
    // async uploadMyInfoAvatar(fileName: any){
    //   const result = await axios.post(uploadImgUrl,{file:fileName},await getConfig())
    //   console.log('返回图片路径',result);
    // }
  },

})