import {defineStore} from "pinia";

export const appStore = defineStore('app', {
  state: () => ({
    allTasks: [],
    selectedTask: '',
    searchWord:'',
    contentLoading: false,
    tags: [
      {
        label: '全部',
        checked: true
      },
      {
        label: '应用',
        checked: false
      },
      // {
      //   label: '应用市场',
      //   checked: false
      // },
      {
        label: '网页',
        checked: false
      },
      {
        label: '标签组',
        checked: false
      }
    ],
    searchResult: [],
    itemReadyedIndex:0,
    itemReadyedItem: {},
    apps: [],
  }),
  getters: {
    getAllTasks() {
      return this.allTasks
    },
    getSelectedTask() {
      return this.selectedTask
    }
  },
  mutations: {
    REFRESH_ALLTASKS: (state, tasksList) => {
      this.allTasks = tasksList
    },
    SET_SELECTEDTASK: (state, selectedTask) => {
      this.selectedTask = selectedTask
    }
  },
  actions: {}
})
