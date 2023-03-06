import {defineStore} from "pinia";
import {myStore} from '../util.js'
export const appsStore = defineStore('apps', {
  state: () => ({
    myApps:[],
    qingApps:[]
  }),
  actions:{
    loadData(){
      appsStore().$patch(myStore.loadAppData('apps',{
        myApps:[],
        qingApps:[]
      }))
    },

    /**
     * 添加应用
     * @param apps
     */
    addApps(apps) {
      this.appData.apps.myApps = this.appData.apps.myApps.concat(apps)
      this.saveAppData('apps')
    },

    /**
     * 删除应用
     * @param findApp
     */
    deleteApp(findApp){
      try{
        this.appData.apps.myApps.splice(this.appData.apps.myApps.findIndex(app=>{
          return app===findApp
        }),1)
        this.saveAppData('apps')
      }catch (e) {

      }
    }
  }
})
