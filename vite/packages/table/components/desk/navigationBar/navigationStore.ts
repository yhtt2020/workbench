import {defineStore} from 'pinia'

export const useNavigationStore=defineStore('useNavigationStore',{
    state:()=>{
        return {
            editToggle:false
        }
    },
    actions:{
        toggleEdit(){
            this.editToggle=!this.editToggle
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