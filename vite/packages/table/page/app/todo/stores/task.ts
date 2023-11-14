import {defineStore} from "pinia";
import {ITaskInfo, ITaskInfo as TaskInfo} from "../interfaces";
import {nanoid} from "nanoid";
import listStore from "./list";
import configStore from './config'
import dbStorage from '../../../../store/dbStorage'
// @ts-ignore
import _ from 'lodash-es'
import {sortType} from "../consts";

// @ts-ignore
export const taskStore = defineStore('task', {
  state: () => {
    return {
      tasks: [] as TaskInfo[],
      currentTasks: [] as TaskInfo[],
      activeTask: <TaskInfo>{},
      taskFilter: null,
    }

  },
  getters: {
    displayList: (state) => {
      //显示
      let displayArray = state.tasks
      if (state.taskFilter) {
        displayArray = state.tasks.filter(task => {
          return state.taskFilter(task)
        })
      }

      if (!configStore().config.showComplete) {
        displayArray = displayArray.filter(item => !item.completed)
      }
      if (listStore().activeList === null || typeof listStore().activeList === 'undefined') {
        //不做处理
      } else if (listStore().activeList.nanoid) {
        displayArray = displayArray.filter(item => {
          if (item.listNanoid) {
            return item.listNanoid.indexOf(listStore().activeList.nanoid) > -1
          } else {
            return false
          }
        })//todo
      }
      if (configStore().config.sort.value === sortType.TIME.value) {
        displayArray = displayArray.sort((a, b) => {
          return (a.deadTime || -10) - (b.deadTime || -10)
        })
      } else if (configStore().config.sort.value === sortType.TITLE.value) {
        displayArray = displayArray.sort((a, b) => {
          return (a.title > b.title ? 1 : -1)
        })
      } else if (configStore().config.sort.value === sortType.LIST.value) {
        displayArray = displayArray.sort((a, b) => {
          return ((a.listNanoid || 0) > (b.listNanoid || 0) ? 1 : -1)
        })
      }

      return displayArray
    }
  },
  actions: {
    add(item: TaskInfo) {
      if (item.title.trim() === '') {
        return false
      }
      let newTask ={
          nanoid: nanoid(6),
          createTime: Date.now(),
          description: '',
          descriptionType: {title: '纯文字', name: 'text'},
          ...item,
        }
      console.log(newTask,'添加的任务——————————————————')
      this.tasks.unshift(newTask)
      console.log(this.tasks,'添加后的数据')
      return true
    },
    setActiveTask(task: TaskInfo) {
      this.activeTask = task
    },
    removeTask(nanoid: string) {
      if (this.activeTask.nanoid === nanoid) {
        this.activeTask = {}
      }
      this.tasks.splice(this.tasks.findIndex(task => task.nanoid === nanoid), 1)
    }
  },
  persist: {
    enabled: true,
    strategies: [
      {
        // 自定义存储的 key，默认是 store.$id
        // 可以指定任何 extends Storage 的实例，默认是 sessionStorage
        storage: dbStorage,
        paths: ['tasks', 'currentTasks', 'activeTask', 'taskFilter']
        // state 中的字段名，按组打包储存`
      },
    ],
  }

})

export default taskStore
