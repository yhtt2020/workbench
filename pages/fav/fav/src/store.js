import { createStore } from 'vuex'

// 创建一个新的 store 实例
const store = createStore({
  state () {
    return {
      currentTab:{
        name:'all',
      },
      /**
       * 当前文件夹
       */
      currentFolder:{
        path:'',
        name:'我的图片'
      },
      /**
       * 当前选中的文件的信息
       */
      selectedContentInfo: {
        cover:'',
        name:'名称名称',
        remark:'备注备注',
        href:'http://apps.vip',
        rate:4.5,

        //基本信息
        baseInfo:{
          filename:'',
          path:'',
          createTime:Date.now(),
          modifyTime:Date.now(),
          addTime:Date.now(),
        }
      }
    }
  },
  mutations: {
    increment (state) {
      state.count++
    },
    setTab(state,tab){
      state.currentTab=tab
    }
  }
})

export default store
