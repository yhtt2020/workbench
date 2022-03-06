import { createStore } from 'vuex'

// 创建一个新的 store 实例
const store = createStore({
  state () {
    return {
      /**
       * 列表的尺寸
       */
      itemSize:100,
      subFolders:[{
        cover:'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png?undefined',
        name:'产品设计',
        contentsCount:13
      },
        {
          cover:'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png?undefined',
          name:'产品战略',
          contentsCount:22
        }],
      contents:[{

      }],




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
    },
    setItemSize(state,size){
      state.itemSize=size
    }
  }
})

export default store
