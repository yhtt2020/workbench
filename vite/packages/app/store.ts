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

