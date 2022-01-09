const userAppsApi = require('../util/api/userAppsApi')
const groupApi = require('../util/api/groupApi')
const baseApi = require('../util/api/baseApi')
const store = new Vuex.Store({
  state: {
    //当前用户
    userInfo: {},
    //云端用户相关
    appUserNavs: [],
    userNavApps:[],
    //云端团队相关
    myGroups:[],
    appGroupNavs: [],
    groupNavApps:[],

  },
  getters: {
    getCurrentUser: state => {
      return state.userInfo
    },
    getAppUserNavs: state => {
      return state.appUserNavs
    },
    getUserNavApps: state => {
      return state.userNavApps
    },
    getMyGroups: state => {
      return state.myGroups
    },
    getAppGroupNavs: state => {
      return state.appGroupNavs
    },
    getGroupNavApps: state => {
      return state.groupNavApps
    },
  },
  mutations: {
    //设置当前用户
    SET_USERINFO: (state, userInfo) => {
      state.userInfo = userInfo
    },
    //设置我的云端导航
    SET_APPUSERNAVS: (state, appUserNavs) => {
      state.appUserNavs = appUserNavs
    },
    SET_USERNAVAPPS: (state, userNavApps) => {
      state.userNavApps = userNavApps
    },
    SET_MYGROUPS: (state, myGroups) => {
      state.myGroups = myGroups
    },
    SET_APPGROUPNAVS: (state, appGroupNavs) => {
      state.appGroupNavs = appGroupNavs
    },
    SET_GROUPNAVAPPS: (state, groupNavApps) => {
      state.groupNavApps = groupNavApps
    },
  },
  actions: {
    //获取当前用户
    async getCurrentUser({commit}) {
      const result = await baseApi.getCurrentUser()
      commit('SET_USERINFO', result)
    },
    //云端用户相关
    async getAppUserNavs({commit}) {
      const result = await userAppsApi.getAppUserNavs()
      if(result.code === 1000) {
        commit('SET_APPUSERNAVS', result.data)
      }
    },
    async addAppUserNav({commit}, data) {
      return await userAppsApi.addAppUserNav(data)
    },
    async deleteAppUserNav({commit}, data) {
      return await userAppsApi.deleteAppUserNav(data)
    },
    async updateAppUserNav({commit}, data) {
      return await userAppsApi.updateAppUserNav(data)
    },

    async getUserNavApps({commit}, data) {
      const result = await userAppsApi.getUserNavApps(data)
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
    },

    //云端团队相关
    async getMyGroups({commit}, data) {
      const result = await groupApi.getGroups()
      if(result.code === 1000) {
        commit('SET_MYGROUPS', result.data)
      }
    },

    async getAppGroupNavs({commit}, data) {
      const result = await groupApi.getAppGroupNavs(data)
      if(result.code === 1000) {
        commit('SET_APPGROUPNAVS', result.data)
      }
    },
    async addAppGroupNav({commit}, data) {
      return await groupApi.addAppGroupNav(data)
    },
    async updateAppGroupNav({commit}, data) {
      return await groupApi.updateAppGroupNav(data)
    },
    async deleteAppGroupNav({commit}, data) {
      return await groupApi.deleteAppGroupNav(data)
    },


    async getGroupNavApps({commit}, data) {
      const result = await groupApi.getGroupNavApps(data)
      if(result.code === 1000) {
        commit('SET_GROUPNAVAPPS', result.data)
      }
    },
    async addGroupNavApps({commit}, data) {
      return await groupApi.addGroupNavApps(data)
    },
    async delGroupNavApps({commit}, data) {
      return await groupApi.delGroupNavApps(data)
    },
    async updateGroupNavApps({commit}, data) {
      return await groupApi.updateGroupNavApps(data)
    },
  }
})

module.exports = store
