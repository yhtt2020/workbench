import {defineStore} from 'pinia'

export const useNavigationStore=defineStore('useNavigationStore',{
    state:()=>{
        return {
            editToggle:false,
            // 用户中心，社区助手，任务中心
            bottomToggle:[ true,true,true ],
            iconSetting:{
                iconName:true,
                iconRounded:true,
                iconBackground:false
            },
            selectNav:'',
            currentList:{
                name:'',
                tag:'',
                list:[],

            },
            // 第一次进入，显示推荐
            introduceVisible:true,
        }
    },
    actions:{
        toggleEdit(){
            this.editToggle=!this.editToggle
        },
    },
    persist: {
        enabled: true,
        strategies: [
          {
            paths: ['editToggle','iconSetting','selectNav','introduceVisible'],
            // storage: dbStorage,
            storage: localStorage,
          },
        ],
      },
})