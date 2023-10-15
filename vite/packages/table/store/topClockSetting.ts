import {defineStore} from 'pinia'
import dbStorage from "./dbStorage";


export const topClockSettingStore = defineStore("topClockSetting", {
    state: () => ({
        topClockSettingVisible: false,
        checkTopClock:true,
        soundVisible:true,
    }),
    actions:{
        changeSettingStatus() {
            this.topClockSettingVisible = !this.topClockSettingVisible
        },
        // 设置控制顶部按钮的显示与隐藏
        changeTopClockStatus(value){
            this.checkTopClock = value
            // console.log(this.checkTopClock,'控制顶部按钮的显示与隐藏');
            
        },
        changeSoundStatus  (value) {
            this.soundVisible= value
        }
    },
    persist: {
        enabled: true,
        strategies: [{
          // 自定义存储的 key，默认是 store.$id
          // 可以指定任何 extends Storage 的实例，默认是 sessionStorage
          paths: ['checkTopClock','topClockSettingVisible','soundVisible'],
          storage: dbStorage,
          // state 中的字段名，按组打包储存
        }]
      }
})