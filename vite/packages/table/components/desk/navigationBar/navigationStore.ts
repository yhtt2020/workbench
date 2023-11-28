import {defineStore} from 'pinia'

export const useNavigationStore=defineStore('useNavigationStore',{
    state:()=>{
        return {
            editToggle:false,
            bottomToggle:[
                {userCenterVisible:true},
                {teamVisible:true},
                {taskBoxVisible:true},
            ],
            
            iconSetting:{
                iconName:true,
                iconRounded:true,
                iconBackground:false
            },
            selectNav:'',
            currentList:[],
        }
    },
    actions:{
        toggleEdit(){
            this.editToggle=!this.editToggle
        },
        toggleTaskBox(){
            this.taskBoxVisible=!this.taskBoxVisible
        }
    },
    persist: {
        enabled: true,
        strategies: [
          {
            paths: ['editToggle','taskBoxVisible','iconSetting','selectNav'],
            // storage: dbStorage,
            storage: localStorage,
          },
        ],
      },
})