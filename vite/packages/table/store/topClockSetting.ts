import {defineStore} from 'pinia'
import dbStorage from "./dbStorage";


export const topClockSettingStore = defineStore("topClockSetting", {
    state: () => ({
        topClockSettingVisible: false,
        checkTopClock:true,
    }),
    actions:{
        changeSettingStatus() {
            this.topClockSettingVisible = !this.topClockSettingVisible
        },
        // 设置控制顶部按钮的显示与隐藏
        changeTopClockStatus(){
            this.checkTopClock = !this.checkTopClock
            // console.log(this.checkTopClock);
            
        }
    }
})