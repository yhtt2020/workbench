import {defineStore} from "pinia";
import {DataSourceTypes, MenuState,sortType} from "../consts";
import {ISort, IListInfo} from "../interfaces";
import {ref} from "vue";
window.addEventListener('resize',()=>{
    configStore().runtime.windowWidth=document.body.clientWidth
})
export const configStore = defineStore('config', {
    state: () => {
        return {
            dataSourceType: DataSourceTypes.LOCAL_STORAGE, //cloud
            config: {
                menuState: MenuState.FOLD,
                showComplete:false,
                sort:<ISort>sortType.TIME,
            },
            runtime:{
                windowWidth:document.body.clientWidth
            },
            filter:{

            }
        }
    },
    actions: {
        toggleMenu() {
            if (typeof this.config.menuState === 'undefined') {
                this.config.menuState = MenuState.FOLD
            }
            this.config.menuState = this.config.menuState === MenuState.FOLD ? MenuState.UN_FOLD : MenuState.FOLD
            console.log(this.config.menuState)
        },
        showCompleted(){
            this.config.showComplete=true
        },
        hideCompleted(){
            this.config.showComplete=false
        },
        setSort(list:IListInfo, sort:ISort){
            console.log(list,sort)
            if(!list){
                this.config.sort=sort
            }
        }

    }
})
