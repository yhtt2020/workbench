import {defineStore} from "pinia";

// @ts-ignore
export const deckStore=defineStore('deck',{
  state:()=>({

    settings:{
      iconSize:'middle'// small large
    },
    editing:false,//可编辑
    deletedItems:[] as string[],
    /**
     * 临时性布局，一般是指拖动过程中的布局
     */
    layouts: {

    },
    /**
     * 存储后的布局，一般是指确认之后的布局
     */
    defaultLayouts:{

    },
    grids:[

    ] as IGrid[]
  }),
  actions:{
    initGrids(){
      this.grids=[{
        id: "1",
        title: '示例操作',
        children: [
          {
            id:"1",
            icon: '',
            type:'font',
            font:{
              text:'浏览器',
              size:'20'
            },
            cover: '',
            title: '打开内置浏览器',
            action:{
              name:'addTab',
              type:{

              },
              args:{

              }
            }
          }]
      }]
    }
  },
  persist: {
    enabled: true,
    strategies: [{
      // 自定义存储的 key，默认是 store.$id
      // 可以指定任何 extends Storage 的实例，默认是 sessionStorage
      storage: localStorage,
      // state 中的字段名，按组打包储存
    }]
  }
})
