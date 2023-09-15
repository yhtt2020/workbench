import { defineStore } from "pinia";
import dbStorage from "../../../store/dbStorage";
import { sUrl } from "../../../consts";
import { post, postMock } from "../../../js/axios/request";
import { serverCache, localCache } from "../../../js/axios/serverCache";

const createGroupUrl = sUrl("/app/community/create");

// @ts-ignore
export const communityGroupStore = defineStore('communityGroup',{
  state: () => ({
   list:[], // 接收我的社群
  }),

  actions: {
   // 创建社群
   async createCommunity(option: any) {
    return await post(createGroupUrl, option);
   },
   
   // 获取我的社群
   


  },
});
