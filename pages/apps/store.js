const userAppsApi = require('../util/api/userAppsApi')
const store = new Vuex.Store({
  state: {
    appUserNavs: [],
    userNavApps:[]
  },
  getters: {
    getAppUserNavs: state => {
      return state.appUserNavs
    },
    getUserNavApps: state => {
      return state.userNavApps
    }
  },
  mutations: {
    //设置我的云端导航
    SET_APPUSERNAVS: (state, appUserNavs) => {
      state.appUserNavs = appUserNavs
    },
    SET_USERNAVAPPS: (state, userNavApps) => {
      state.userNavApps = userNavApps
    }
  },
  actions: {
    async getAppUserNavs({commit}) {
      const result = await userAppsApi.getAppUserNavs()
      console.log(result, '__list__')
      if(result.code === 1000) {
        commit('SET_APPUSERNAVS', result.data)
      }
    },
    async addAppUserNav({commit}, data) {
      return await userAppsApi.addAppUserNav(data)
    },


    async getUserNavApps({commit}, data) {
      const result = await userAppsApi.getUserNavApps(data)
      console.log(result, '__apps__')
      if(result.code === 1000) {
        commit('SET_USERNAVAPPS', result.data)
      }
    },
    async addUserNavApps({commit}, data) {
      return await userAppsApi.addUserNavApps(data)
    },
    async delUserNavApps({commit}, data) {
      return await userAppsApi.delUserNavApps(data)
    },
    async updateUserNavApps({commit}, data) {
      return await userAppsApi.updateUserNavApps(data)
    }
  }
})

module.exports = store
