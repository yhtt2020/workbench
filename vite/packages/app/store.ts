import {defineStore} from "pinia";

const {appModel,devAppModel}=window.$models
export const appStore = defineStore('app', {
  state: () => ({
    app:{
      name:'',
      url:'',
      theme_color:'',
      user_theme_color:''
    },
    setting:{  //设置，用户设置的

    },
    config:{ //配置，开发人员设置的

    },
    devApp:{
        package:'',
      theme_color:'',
      theme_colors:{}
    },
    debugMod:false
  }),
  actions:{
    async getApp(id){
      this.app=await appModel.get({nanoid: id})
      console.log(this.app)
    },
    async toggleDebug(){
      this.debugMod=!this.debugMod
    },
    async setDevApp(devApp){
      this.devApp=devApp
      this.devApp.theme_colors={
        hex:this.devApp.theme_color || '#000000'
      }
      this.debugMod=true
    },
    async reloadDevApp(){
      let devApp=await devAppModel.get(this.devApp.nanoid)
      await this.setDevApp(devApp)
    },
    async saveDevApp(){

    }
  }

})

