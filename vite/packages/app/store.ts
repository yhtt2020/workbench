import {defineStore} from "pinia";
import _ from 'lodash-es';
const {appModel, devAppModel} = window.$models
export const appStore = defineStore('app', {
  state: () => ({
    app: {
      name: '',
      url: '',
      theme_color: '',
      user_theme_color: ''
    },
    setting: {  //设置，用户设置的

    },
    config: { //配置，开发人员设置的

    },
    devApp: {
      package: '',
      theme_color: '',
      theme_colors: {}
    },
    debugMod: false
  }),
  actions: {
    async getApp(id) {
      this.app = await appModel.get({nanoid: id})
    },
    async toggleDebug() {
      this.debugMod = !this.debugMod
    },
    async setDevApp(devApp) {
      this.devApp = devApp
      this.devApp.theme_colors = {
        hex: this.devApp.theme_color || '#000000'
      }
      this.devApp.auth=JSON.parse(this.devApp.auth)
      this.devApp.window=JSON.parse(this.devApp.window)
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
      await devAppModel.save(devApp.nanoid,devApp)
      console.log('要保存的应用', devApp)
    }
  }

})

