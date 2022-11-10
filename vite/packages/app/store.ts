import {defineStore} from "pinia";
import _ from 'lodash-es';
const {appModel, devAppModel} = window.$models
const initSetting={ //存储用户的设置
  name:'',
  theme_color:'',
  theme_colors:{},
  url:'',
  summary:'',
  optimize:{},
  auth:{
    base:{},
    api:{},
    ability:{}
  }
}
export const appStore = defineStore('app', {
  state: () => ({
    app: {
      name: '',
      url: '',
      theme_color: '',
      user_theme_color: ''
    },
    userSetting:initSetting,
    setting: {  //设置，用户设置的

    },
    config: { //配置，开发人员设置的

    },
    devApp: {
      package: '',
      theme_color: '',
      theme_colors: {}
    },
    debugMod: false,


  }),
  actions: {
    async getApp(id) {
      this.app = await appModel.get({nanoid: id})
      this.loadDefaultValues() //先读入默认值

      this.userSetting=_.cloneDeep(Object.assign(this.userSetting,this.app.userSettings)) //再将已经有的值设置进去
      this.userSetting['theme_colors']={hex:this.userSetting['theme_color']}
    },
    async restoreAppSetting(){
      this.userSetting=initSetting //设置到初始设置
      this.loadDefaultValues()
      this.userSetting['theme_colors']={hex:this.userSetting['theme_color']}
      await this.saveAppSetting()
      await this.getApp(this.app.nanoid)
    },
    async reloadAppSetting() {
      await this.getApp(this.app.nanoid)

    },
    async saveAppSetting(){
      let userSetting =_.cloneDeep(this.userSetting)
      userSetting.theme_color = userSetting.theme_colors.hex
      //userSetting.window=JSON.stringify(userSetting)
      delete userSetting.theme_colors
      //delete userSetting.assignAppsInfo
      await appModel.setUserSetting(this.app,userSetting)
    },
    /**
     * 读入初始值
     */
    loadDefaultValues(){
      Object.keys(this.userSetting).forEach(key=>{
        if(typeof this.userSetting[key] !=='undefined'){
          this.userSetting[key]=this.app.origin[key]
        }
      })

    },
    async toggleDebug() {
      this.debugMod = !this.debugMod
    },
    async setDevApp(devApp) {
      this.devApp = devApp
      this.devApp.theme_colors = {
        hex: this.devApp.theme_color || '#000000'
      }

      this.devApp.use_debug_url=!!this.devApp.use_debug_url
      this.debugMod = true
      return true
    },
    async reloadDevApp() {
      let devApp = await devAppModel.get(this.devApp.nanoid)
      await this.setDevApp(devApp)
    },
    async saveDevApp() {
      let devApp =_.cloneDeep(this.devApp)
      devApp.theme_color = devApp.theme_colors.hex
      devApp.auth=JSON.stringify(this.devApp.auth)
      if((!this.devApp.window.frameWindow.enable && !this.devApp.window.window.enable && !this.devApp.window.attach.enable ) || !this.devApp.window[this.devApp.window.defaultType].enable ){
        throw '至少设置一种窗体，且正确设置默认窗体类型。'
      }
      devApp.window=JSON.stringify(this.devApp.window)
      delete devApp.theme_colors
      delete devApp.assignAppsInfo
      await devAppModel.save(devApp.nanoid,devApp)
    }
  }

})

