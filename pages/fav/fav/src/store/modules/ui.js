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
      alias: '全部'
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
  },
  getters: {}
}

export default ui
