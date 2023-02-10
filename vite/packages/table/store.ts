import {defineStore} from "pinia";
import * as util from "util";
import {nanoid} from 'nanoid'
// import _ from 'lodash-es';
// const {appModel, devAppModel} = window.$models
const initSetting = { //存储用户的设置
  name: '',
  theme_color: '',
  theme_colors: {},
  url: '',
  summary: '',
  optimize: {},
  auth: {
    base: {},
    api: {},
    ability: {}
  },
}

export const appStore = defineStore('appStore', {
  state: () => ({

    settings:{
      showButtonTitle:false,
      darkMod:true
    }

  }),
  getters: {

  },

  actions: {

  }
})

