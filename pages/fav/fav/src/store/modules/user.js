/**
 * 用户模块
 * @type {{mutations: {updateContents(*, *): void}, state: (function(): {contents: [{extData: {domain: string, pwd: string, username: string}, name: string, href: string, type: string}]}), getters: {}}}
 */
const user= {
  namespaced:true,
  state:()=>({
    userInfo:{
      nickname:'想天浏览器',
      avatar:'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png?undefined',
      uid:0,
      spaceUrl:'https://s.apps.vip/user',
      userToken:'',
      token:'',
      userData:{}
    },
    folders:[]
  }),
  mutations:{
    /**
     * 设置用户信息
     * @param state
     * @param user 用户数据体
     */
    setUserInfo(state,user){
      if(user){
        state.userInfo={
          nickname:user.nickname,
          avatar:user.avatar,
          uid:user.uid,
          spaceUrl:'https://s.apps.vip/user',
          userToken:user.token,
          userData:user
        }
      }else{
        state.userInfo={
          nickname:'未登录',
          avatar:'',
          uid:0,
          spaceUrl:'',
          userToken:'',
          userData:null
        }
      }
    }
  },
  getters:{

  }
}

export default user
