const groupApi=require('../api/groupApi')
const groupModel = {
  getMyList: async () => {
      return  groupApi.getGroups()

  },
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
