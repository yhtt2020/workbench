import {defineStore} from "pinia";

const {appModel}=window.$models
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
    debugMod:false
  }),
  actions:{
    async getApp(id){
      this.app=await appModel.get({nanoid: id})
      console.log(this.app)
    },
    async toggleDebug(){
      this.debugMod=!this.debugMod
    }
  }

})

