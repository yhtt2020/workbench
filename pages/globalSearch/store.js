const store = new Vuex.Store({
  state: {
    allTasks: [],
    selectedTask: ''
  },
  getters: {
    getAllTasks: state => {
      return state.allTasks
    },
    getSelectedTask: state => {
      return state.selectedTask
    }
  },
  mutations: {
    REFRESH_ALLTASKS: (state, tasksList) => {
      state.allTasks = tasksList
    },
    SET_SELECTEDTASK: (state, selectedTask) => {
      state.selectedTask = selectedTask
    }
  },
  actions: {}
})

module.exports = store
