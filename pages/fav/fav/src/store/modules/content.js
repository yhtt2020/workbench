/**
 * 团队模块
 * @type {{mutations: {updateContents(*, *): void}, state: (function(): {contents: [{extData: {domain: string, pwd: string, username: string}, name: string, href: string, type: string}]}), getters: {}}}
 */
const group = {
  namespaced:true,
  state: () => ({
    contents: [{
      name: '我的密码',
      type: 'pwd',
      extData: {
        domain: 'zt.xiangtian.ren',
        username: 'cyx',
        pwd: 'chenyixiao1'
      },
      href: 'zt.xiangtian.ren'
    }]
  }),
  mutations: {
    /**
     * 更新当前显示的内容
     * @param state
     * @param contents
     */
    updateContents (state, contents) {
      state.contents = contents
    },
  },
  getters: {}
}

export default group
