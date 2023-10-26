import {defineStore} from "pinia";
import dbStorage from "../../store/dbStorage";
import {nanoid} from "nanoid";

import {keyData, appMap, marketList} from './defaultData'
import {useRouter} from 'vue-router'

// @ts-ignore
export const keyStore = defineStore("key", {
  state: () => ({
    currentApp: {
      software: {}
    },//当前应用
    currentScheme: {},//当前快捷键方案
    executedApps: [],//运行过的应用

    customApps: [],//自定义应用，就是那些我们没定义的应用，已经定义过的也会被存入，只是会优先使用定义的数据
    sessionList: [],//会话列表
    //快捷键方案列表
    // shortcutKeyList: [...keyData.concat()],
    shortcutKeyList: [],
    // 最近使用的快捷键方案列表
    recentlyUsedList: [],
    // 推荐方案列表
    // sellSchemeList: [...keyData.concat()],
    sellSchemeList: [...keyData.concat()],
    //创意市场列表
    marketList: marketList,
    schemeList: [],
    settings: {
      enableAutoChange: false,
      enableAutoEnter: true,
    }
  }),
  actions: {
    async loadShortcutSchemes(exeName) {
      const dbKey = 'shortcut:scheme:'

      let map: any = {
        $and: [
          {
            _id: {
              $regex: new RegExp(`^${dbKey}`)
            }
          }
        ]

      }
      if (exeName) {
        map.$and.push({
          $or:
            [{
              exeName: {
                $elemMatch: {
                  $regex: new RegExp(exeName)
                }
              },

            },
              {
                exeName: exeName
              }
            ]
        }) //增设一个数组包含或者字符串相等的条件
      }
      await tsbApi.db.createIndex({
        index: {
          fields: ['exeName']
        }
      })
      let rs = (await tsbApi.db.find({
        selector: map,
        sort: [
          {
            '_id': 'desc',
          }
        ]
      })).docs

      let schemes = rs

      for(const scheme of schemes){
        scheme.software=await this.getCustomApp(scheme.exeName)
      }
      // if(this.schemeList.length===0){
      //  //  for (const scheme of keyData) {
      //  //    let rs=await tsbApi.db.put({
      //  //      _id: 'shortcut:scheme:'+Date.now(),
      //  //      ...scheme
      //  //    })
      //  //    console.log(rs,'添加')
      //  //    if(rs.ok){
      //  //      schemes.push(rs.doc)
      //  //    }
      //  //  }
      //  // // console.log(schemes,'方案列表')
      //
      //  // this.schemeList=[...keyData.concat()]
      // }
      console.log(schemes,'列表')
      return schemes
    },
    async setRecentlyUsedList(item) {
      this.recentlyUsedList=this.recentlyUsedList.filter(list=>{
        return list.id!==item.id
      })
      if(!item.icon){
        let software=await this.getCustomApp(item.exeName)
        item.icon=software.icon
      }
      this.recentlyUsedList.unshift(item)
    },
    setSchemeList(item) {
      this.shortcutKeyList.find((i, index) => {
        if (i.id === item.id) {
          this.shortcutKeyList.splice(index, 1, item)
        }
      })
    },
    /**
     * 保存方案
     * @param scheme
     */
    async saveScheme(scheme) {
      console.error('执行了一次保存操作')
      let rs = await tsbApi.db.put({
        ...scheme
      })
      console.log('保存结果',rs)
      if (rs.ok) {
        return rs
      }else{
        return false
      }
    },
    /**
     * 添加方案
     * @param scheme
     * @param exeName
     */
    async addScheme(scheme, exeName) {
      let rs = await tsbApi.db.put({
        _id: 'shortcut:scheme:' + Date.now(),
        ...scheme,
        exeName: exeName
      })
      if (rs.ok) {
        return rs.doc
      }
    },
    setShortcutKeyList(item) {
      this.shortcutKeyList.push(JSON.parse(JSON.stringify(item)))
    },
    /**
     * 删除方案
     * @param item
     */
    async removeScheme(item) {
      await tsbApi.db.remove(item)
      // let itemIndex = this.items.findIndex(li => {
      //   if (li._id === item._id) {
      //     return true
      //   }
      // })
      // if (itemIndex > -1) {
      //   this.items.splice(itemIndex, 1)
      // }
      // this.shortcutKeyList.map((i, index) => {
      //   if (item.id === i.id) this.shortcutKeyList.splice(index, 1)
      // })
      this.recentlyUsedList.map((i, index) => {
        if (item.id === i.id) this.recentlyUsedList.splice(index, 1)
      })
      this.marketList[this.marketList.length - 1].children.map((i, index) => {
        if (item.id === i.id) this.marketList[this.marketList.length - 1].children.splice(index, 1)
      })
    },
    setMarketList(item) {
      if (this.marketList[this.marketList.length - 1].children.find(i => i.id === item.id)) {
        this.marketList[this.marketList.length - 1].children.find((i, index) => {
          if (i.id === item.id) {
            this.marketList[this.marketList.length - 1].children.splice(index, 1, item)
          }
        })
        this.setSchemeList(item)
      } else {
        this.marketList[this.marketList.length - 1].children.push(item)
        if (this.shortcutKeyList.find(i => i.id === item.id)) {
          this.setSchemeList(item)
        } else {
          this.setShortcutKeyList(item)
        }
      }
    },
    delRecentlyEmpty({keyList, id}) {
      this.recentlyUsedList.forEach((item, index) => {
        if (item.id == id) {
          this.recentlyUsedList[index].keyList = keyList
        }
      })
    },
    async getScheme(id){
      return await  this.findScheme({
        _id: id
      })
    },
    async getRepApp(exeName, filePath) {
      return await this.getCustomApp(exeName, filePath)
    },
    /**
     * 获取应用，如果不存在，则根据filePath自动拉取icon，并创建新的应用信息
     * @param exeName
     * @param filePath
     */ async getCustomApp(exeName, filePath = '') {
      let found = this.customApps.find(item => {
        return item.exeName === exeName
      })

      if (found) {
        return found
      } else {
        let foundRep = appMap.find(app => {
          if (typeof app.exeName == 'string') {
            return app.exeName === exeName
          } else {
            return app.exeName.includes(exeName)
          }
        }) || {}
        let icon = await tsbApi.system.extractFileIcon(filePath)
        let newApp = {
          company: '',
          alias: exeName,
          exeName: exeName,
          ...foundRep,
          icon: icon || '/icons/winapp.png',
          path: filePath,
          id: nanoid(8),
          hide: false,
        }
        this.customApps.push(newApp)
        return newApp
      }
    },
    async removeCustomApp(app) {
      let found = this.customApps.findIndex(item => {
        return item.id === app.id
      })
      if (found > -1) {
        this.customApps.splice(found, 1)
      }

      let foundExecutedApp = this.executedApps.findIndex(item => {
        return item.exeName === app.exeName
      })
      if (foundExecutedApp > -1) {
        this.executedApps.splice(foundExecutedApp, 1)
      }
      await this.syncSessionList()
    },
    async syncSessionList(cb) {
      this.sessionList = this.executedApps.map(app => {
        return {
          img: app.software.icon,
          title: app.software.alias,
          id: app.exeName,
          hide: app.hide,
          noBg: true,
          tab: 'exeName_' + app.exeName,
          callBack: () => {
            this.currentApp = app
            if (cb) {
              cb(app)
            } else {
              useRouter().push({
                name: 'schemeList',
                params: {
                  exeName: app.exeName
                }
              })
            }
          }
        }
      })
    },
    async findScheme(map, size = 5) {
      let rsFiltered = await tsbApi.db.find({
        selector: map,
        limit: size,
        sort: [
          {
            '_id': 'desc'
          }
        ]
      })
      return rsFiltered
    },

    /**
     * 导入方案
     * @param schemes
     */
    async import(schemes) {
      const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))
      let insertSchemes = []
      for (const scheme of schemes) {
        let foundSchemes = await this.findScheme({
          _id: scheme._id
        })
        if (foundSchemes.docs.length > 0) {
          scheme._id = 'shortcut:scheme:' + Date.now()
        }
        scheme.id = nanoid()
        scheme.name = scheme.name + '_' + (scheme.id.slice(0, 4))

        scheme.selected = false
        delete scheme._rev
        insertSchemes.push(scheme)
        await tsbApi.db.put(scheme)
        await sleep(1)//每毫秒执行一次，防止名称冲突
        console.log(foundSchemes, '找到同名方案')
      }

      return insertSchemes

    }
  },
  persist: {
    enabled: true,
    strategies: [
      {
        // 自定义存储的 key，默认是 store.$id
        // 可以指定任何 extends Storage 的实例，默认是 sessionStorage
        paths: ['customApps', 'shortcutKeyList', 'recentlyUsedList', 'sellSchemeList', 'marketList', 'sessionList', 'executedApps', 'currentApp', 'settings'],
        storage: dbStorage,
        // state 中的字段名，按组打包储存
      },
    ],
  },
});
