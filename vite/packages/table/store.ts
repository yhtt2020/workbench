import {defineStore} from "pinia";
import * as util from "util";
import {nanoid} from 'nanoid'
// import _ from 'lodash-es';
// const {appModel, devAppModel} = window.$models


export const appStore = defineStore('appStore', {
  state: () => ({
    apps:[],

    fullScreen:false,//是否是全屏模式

    settings:{
      showButtonTitle:false,
      darkMod:true
    },

    routeUpdateTime:Date.now(),//用于更新滚动条
    status:{
      music:{//存当前播放的音乐
        notInit:true,
        cover:''
      }
    }

  }),
  getters: {

  },

  actions: {
    save(){

    },
    addApps(apps){
      console.log(apps)
      this.apps=this.apps.concat(apps)
      console.log(this.apps)
    }
  }
})

