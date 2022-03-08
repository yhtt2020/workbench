/**
 * 子文件夹模块
 * @type {{mutations: {updateContents(*, *): void}, state: (function(): {contents: [{extData: {domain: string, pwd: string, username: string}, name: string, href: string, type: string}]}), getters: {}}}
 */
const subFolder = {
  namespaced:true,
  state: () => ({
    subFolders: [],
  }),
  mutations: {

  },
  getters: {}
}

export default subFolder
