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
    }
})