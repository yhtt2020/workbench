import {defineStore} from "pinia";
import * as util from "util";
import {nanoid} from 'nanoid'
const tools = window.$models.util.tools
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

export const appStore = defineStore('app', {
  state: () => ({


  }),
  getters: {

  },

  actions: {

  }
})
