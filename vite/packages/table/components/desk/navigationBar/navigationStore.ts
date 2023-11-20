import {defineStore} from 'pinia'

export const useNavigationStore=defineStore('useNavigationStore',{
    state:()=>{
        return {
            editToggle:false,
            taskBoxVisible:true
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
            paths: ['editToggle'],
            // storage: dbStorage,
            storage: localStorage,
          },
        ],
      },
})