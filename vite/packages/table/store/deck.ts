import {defineStore} from "pinia";

// @ts-ignore
export const deckStore=defineStore('deck',{
  state:()=>({
    decks:[
      {
        id: 1,
        title: '板子1',
        children: [
          {
            icon: '',
            cover: '',
            title: '微信',
            action:{
              name:'addTab',
              type:{

              },
              args:{

              }
            }
          },
          {
            icon: '',
            cover: '',
            title: '微信',
            action:{

            }
          }
        ]
      },
      {
        id: 2,
        title: '板子1',
        children: [
          {
            icon: '',
            cover: '',
            title: '微信'
          },
          {
            icon: '',
            cover: '',
            title: '微信'
          },
          {
            icon: '',
            cover: '',
            title: '微信'
          }
        ]
      },
    ] as IDeck[]
  }),
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
interface IDeckActionType{
  name:string
  alias:string
}
declare interface IDeckAction{
  /**
   * 名称
   */
  name:'',
  type:IDeckActionType,
  args:any //指令参数
}
declare interface IDeckItem{
  icon:string,
  cover: string,
  title: string,
  action:IDeckActionType
}
declare interface IDeck{
  id:number,
  title:string,
  children?:Array<IDeckItem>[],
}
