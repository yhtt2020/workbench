const groupApi=require('../api/groupApi')
const groupModel = {
  /**
   * 获取全部的List
   * @returns {AxiosPromise<any>}
   */
  getMyList: async () => {
      return  groupApi.getGroups()
  },
  /**
   * 转换为一个tree组件的对象
   * @param data
   * @returns {{}}
   */
  convertTreeNode(data){
    let item = {}
    item.title = data.name
    item.key =  data.id
    item.logo = data.logo
    item.scopedSlots = {
      icon:"custom"
    }
    return item
  }

}

module.exports = groupModel
