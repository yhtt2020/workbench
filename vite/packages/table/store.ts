import {defineStore} from "pinia";
import * as util from "util";
import {nanoid} from 'nanoid'
// import _ from 'lodash-es';
// const {appModel, devAppModel} = window.$models


export const appStore = defineStore('appStore', {
  state: () => ({
    apps:[],

    init:false,//todo 增加初始化设置的保存 是否初始设置过了

    fullScreen:false,//是否是全屏模式

    settings:{
      showButtonTitle:false,
      darkMod:true,
      attachScreen:null//id,bounds
    },

    routeUpdateTime:Date.now(),//用于更新滚动条
    status:{
      music:{//存当前播放的音乐
        notInit:true,
        cover:''
      }
    },
    decks:[
      {
        id:1,
        title:'板子1',
        children:[
          {
            icon:'',
            cover:'',
            title:'微信'
          },
          {
            icon:'',
            cover:'',
            title:'微信'
          }
        ]
      },
      {
        id:2,
        title:'板子1',
        children:[
          {
            icon:'',
            cover:'',
            title:'微信'
          },
          {
            icon:'',
            cover:'',
            title:'微信'
          },
          {
            icon:'',
            cover:'',
            title:'微信'
          }
        ]
      },
    ]

  }),
  getters: {

  },

  actions: {
    save(key,value){
      localStorage.setItem(key,JSON.stringify(value))
    },

    loadAll(){
      this.loadMusic()
      this.init=!!localStorage.getItem('init')
    },

    finishWizard(){
      this.init=true
      localStorage.setItem('init','true')
    },

    setMusic(status){
      this.status.music = status
      this.status.music.cover = status.cover.replace('34y34', '120y120')//修正封面
      this.save('status.music',status)
    },

    loadMusic(){
      this.status.music=JSON.parse(localStorage.getItem('status.music'))
    },
    addApps(apps){
      console.log(apps)
      this.apps=this.apps.concat(apps)
      console.log(this.apps)
    }
  }
})

