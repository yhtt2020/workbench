import {defineStore} from "pinia";

export const appStore = defineStore('app', {
  state: () => ({
    allTasks: [],
    selectedTask: ''
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
