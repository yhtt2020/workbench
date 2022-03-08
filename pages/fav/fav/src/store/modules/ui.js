import contentListModel from '@/models/contentListModel'

/**
 * ui模块
 * @type {{mutations: {updateContents(*, *): void}, state: (function(): {contents: [{extData: {domain: string, pwd: string, username: string}, name: string, href: string, type: string}]}), getters: {}}}
 */
const ui = {
  namespaced:true,
  state: () => ({
    //列表项宽度
    itemSize: 100,
    //当前选项卡
    currentTab: {
      name: 'all',
      alias: '全部',
      path:''
    },
    /**
     * 当前文件夹
     */
    currentFolder: {
      path: '',
      name: '我的图片'
    },
    /**
     * 当前选中的文件的信息
     */
    selectedContentInfo: {
      cover: '',
      name: '名称名称',
      remark: '备注备注',
      href: 'http://apps.vip',
      rate: 4.5,

      //基本信息
      baseInfo: {
        filename: '',
        path: '',
        createTime: Date.now(),
        modifyTime: Date.now(),
        addTime: Date.now(),
      }
    }
  }),
  mutations: {
    /**
     * 设置itemSize，列表内容宽度
     * @param state
     * @param size
     */
    setItemSize (state, size) {
      state.itemSize = size
    },
    /**
     * 设置当前选中的tab
     * @param state
     * @param tab
     */
    setTab (state, tab) {
      state.currentTab = tab
    },
    setCurrentFolder(state,folder){
      state.currentFolder=folder
    }
  },
  getters: {},
  actions:{
    changeFolder(context,folder){
      //是本地，则进行本地文件的导入。
      let files= contentListModel.loadLocalStoreContents(folder.path)
      let contents=[]
      files.forEach(file=>{
        let filename=file.filename
        //const fileInfo=fs.statSync(file)
        contents.push(
          {
            name:file.filename,
            type:'pic',
            ext:'png',
            cover:'file://'+file.path+filename,
            extData:{
              width:'900',
              height:'420'
            },
            href:'http://www.woshipm.com/pd/5336668.html'
          })
      })
      context.commit('content/updateContents',contents,{root:true})
      context.commit('setCurrentFolder',folder)
    },
    changeTab(context,tab){
      switch (tab.name){
        case 'all':
          tab.path=context.rootState.config.storePath
          //todo 重新载入目录
          context.dispatch('changeFolder',{
            path:context.rootState.config.storePath,
            name:''
          })

      }
      context.commit('setTab',tab)
    }
  }
}

export default ui
