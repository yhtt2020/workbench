/**
 * 用户模块
 * @type {{mutations: {updateContents(*, *): void}, state: (function(): {contents: [{extData: {domain: string, pwd: string, username: string}, name: string, href: string, type: string}]}), getters: {}}}
 */
const userModule = {
  namespaced:true,
  state: () => ({
    groups: [
      {
        icon: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png?undefined',
        name: '想天软件',
        folders:[],
        foldersCount: 4,
      },
      {
        icon: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png?undefined',
        name: '浏览器研发组',
        folders:[],
        foldersCount: 7,
      },
    ],
  }),
  mutations: {
    /**
     * 设置用户信息
     * @param state
     * @param user 用户数据体
     */
    saveUserInfo (state, user) {
      if (user) {
        state.userInfo = {
          nickname: user.nickname,
          avatar: user.avatar,
          uid: user.uid,
          spaceUrl: 'https://s.apps.vip/user',
          userToken: user.token,
          userData: user
        }
      } else {
        state.userInfo = {
          nickname: '未登录',
          avatar: '',
          uid: 0,
          spaceUrl: '',
          userToken: '',
          userData: null
        }
      }
    }
  },
  getters: {}
}

export default userModule
