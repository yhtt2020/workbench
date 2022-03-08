const host = 'https://s.apps.vip/'
const clientId = '10001'
/**
 * 配置模块
 * @type {{mutations: {updateContents(*, *): void}, state: (function(): {contents: [{extData: {domain: string, pwd: string, username: string}, name: string, href: string, type: string}]}), getters: {}}}
 */
const config = {
  namespaced:true,
  state: () => ({
    //服务器配置
    server: {
      //登录
      loginUrl: host + 'login?response_type=code&client_id=' + clientId + '&state=1',
      //用户空间
      userSpaceUrl: host + 'user'
    },
    //当前存储空间，默认为用户数据目录下的tmpStore 意思是临时存储
    storePath: '',
  }),
  mutations: {
    /**
     * 设置当前存储的位置
     * @param state
     * @param path
     */
    setStorePath (state, path) {
      state.storePath = path
    },
  },
  getters: {}
}

export default config
