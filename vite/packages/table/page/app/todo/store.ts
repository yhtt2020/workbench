import {defineStore} from "pinia";
import {ITaskInfo as TaskInfo,IListInfo as ListInfo} from './interfaces'
import {nanoid} from 'nanoid'
import _ from 'lodash-es'
import {DataSourceTypes, MenuState, sortType} from './consts'
import {Menu} from "ant-design-vue";
import {listStore} from './stores/list'
import {taskStore} from './stores/task';
import {configStore} from './stores/config'

export const databaseStore = defineStore('database', {
    state: () => {
        return {
            database: {
                tasks: [] as TaskInfo[],
                config: {},
                lists: [] as ListInfo[],
            }
        }
    },
    actions: {
        async getFromDataSource() {
            if (configStore().dataSourceType === DataSourceTypes.LOCAL_STORAGE)
                return JSON.parse(<string>localStorage.getItem('database'))
        },
        async saveToDataSource() {
            if (configStore().dataSourceType === DataSourceTypes.LOCAL_STORAGE) {
                localStorage.setItem('database', JSON.stringify(this.database))
                console.info('saved to localstorage')
            }
        },
        async init() {
            try {
                this.database = await this.getFromDataSource()
                if (this.database === null) {
                    this.database = {
                        tasks: [],
                        config: {},
                        lists:[],
                        activeList:null
                    }
                }
                this.loadTasks()
                this.loadLists()
                this.loadConfigs()
            } catch (e) {
                console.warn(e)
                return false
            }
        },
        async loadTablesObject(tableName: any) {
            let data
            if (typeof this.database[tableName] === 'undefined') {
                this.database[tableName] = {}
            }
            data = this.database[tableName]
            return data
        },
        async loadConfigs() {
            await this.loadTablesObject('config')
            configStore().config = this.database.config
            if(!this.database.config.sort){
                configStore().config.sort=sortType.TIME
            }
        },
        async loadLists() {
            if (typeof this.database.lists === 'undefined') {
                this.database.lists = []
                listStore().lists = []
            } else {
                listStore().lists = this.database.lists
            }
        },
        async loadTasks() {
            if (typeof this.database.tasks === 'undefined') {
                this.database.tasks = []
                taskStore().tasks = []
            } else {
                taskStore().tasks = this.database.tasks
            }
        },
        async save() {
            this.saveToDataSource()
        }
    }
})

export {
    taskStore,listStore,configStore
}
