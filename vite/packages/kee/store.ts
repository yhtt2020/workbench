import {defineStore} from "pinia";
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

export const appStore = defineStore('kee', {
  state: () => ({

    filterInfo: { //当前的筛选器
      id: 0,
      type: 'all',
      text: "所有密码",
      icon: 'AppstoreFilled'
    },


    currentTab: null,
    app: {
      name: '',
      url: '',
      theme_color: '',
      user_theme_color: ''
    },
    user: {
      user_info: {}
    },
    //将点击之后的值进行缓存
    passwordItem: {
      id: 0,
      index: 0,
      title: "禅道账号",
      description: "Francisio_Phillps",
      password: '123456',
      url: "../../../public/img/key_black.svg",
      site_1: 'zt.xaingtian.ren',
      site_2: 'zt.xaingtian.ren'
    },

    currentDb: {
      filePath: '',
      name: '',
      kdbx: {}
    },

    tags: [],//全部标签

    dbList: [],//打开过的密码库

    passwords: []//全部的密码
  }),
  getters: {
    displayPasswords: (state) => {
      const passwords =  state.passwords.map((pwd)=> {
        return {
          ...pwd,
          showCopy : false,
          passwordType: 'password',
          icon : '/kee/key_black.svg'
        }
      })
      return passwords
    }
  },
  actions: {
    setDb(dbInfo) {
      this.currentDb = dbInfo
      this.tags = dbInfo.tags
      const manager = kdbxModel.getManager(dbInfo.filePath)
      passwordModel.setPasswordManager(manager)
      this.getAllPasswords()
      if (this.filterInfo.type === 'all') {
        this.filterInfo.text = dbInfo.name
      }
    },
    getAllPasswords() {
      this.passwords = []
      this.passwords = passwordModel.getAllPasswords()
      window.pina = this
    },
    importPasswords(passwords, groupName, existAction) {
      return passwordModel.importPasswords(passwords, groupName, existAction)
    },
    loadCurrentDb() {
      passwordModel.loadCurrent((err, dbInfo) => {
        if (err) {
          console.warn('打开密码库失败')
          return
        }
        if (dbInfo) {
          this.setDb({
            filePath: dbInfo.filePath,
            kdbx: dbInfo.db,
            tags: dbInfo.tags,
            name: dbInfo.name
          })
        }
      })

    },
    loadDbList() {
      let history = localStorage.getItem('bankList')
      if (history) {
        this.dbList = JSON.parse(history)
      }
    },
    saveDbList() {
      localStorage.setItem('bankList', JSON.stringify(this.dbList))
    },
    getTabData() {
      if (window.tabData) {
        this.currentTab = window.tabData
      }
      let timer = setTimeout(() => {
        if (window.tabData) {
          this.currentTab = window.tabData
          clearInterval(timer)
        }
      }, 500)
    }
  }
})

