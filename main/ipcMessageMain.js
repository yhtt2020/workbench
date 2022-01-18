/**
 * IPC消息类型注册，用于集中填写消息
 * @type {{sidePanel: {setMouseEnable: string, getGlobal: string, setMouseIgnore: string, receiveGlobal: string}}}
 */
const ipcMessageMain={
  sidePanel: {
    /**
     * 设置鼠标可用
     */
    setMouseEnable:'setMouseEnable',
    /**
     * 设置鼠标不可用
     */
    setMouseIgnore:'setMouseIgnore',

    /**
     * 获取全局变量，主要用于更新全局变量
     */
    getGlobal:'getGlobal',
    /**
     * 接收到Global消息
     */
    receiveGlobal:'receiveGlobal'
  },
  /**
   * 主界面使用ipc
   */
  main:{
    /**
     * 打开书签
     */
    openBookmarks:'openBookmarks'
  }
}


