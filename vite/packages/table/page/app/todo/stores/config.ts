import {defineStore} from "pinia";
import {DataSourceTypes, MenuState,sortType} from "../consts";
import dbStorage from '../../../../store/dbStorage'
import {ISort, IListInfo} from "../interfaces";
import {ref} from "vue";
window.addEventListener('resize',()=>{
    configStore().runtime.windowWidth=document.body.clientWidth
})
// @ts-ignore
export const configStore = defineStore('config', {
    state: () => {
        return {
            dataSourceType: DataSourceTypes.LOCAL_STORAGE, //cloud
            config: {
                menuState: MenuState.UN_FOLD,
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
                this.config.menuState = MenuState.UN_FOLD
            }
            this.config.menuState = this.config.menuState === MenuState.FOLD ? MenuState.UN_FOLD : MenuState.FOLD
        },
        showCompleted(){
            this.config.showComplete=true
        },
        hideCompleted(){
            this.config.showComplete=false
        },
        setSort(list:IListInfo, sort:ISort){
            if(!list){
                this.config.sort=sort
            }
        }

    },
    persist: {
        enabled: true,
        strategies: [
          {
            // 自定义存储的 key，默认是 store.$id
            // 可以指定任何 extends Storage 的实例，默认是 sessionStorage
            storage: dbStorage,
            paths: ['dataSourceType','config','runtime','filter']
            // state 中的字段名，按组打包储存
          },
        ],
    }
})

export default configStore
