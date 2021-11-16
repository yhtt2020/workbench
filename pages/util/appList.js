db = require('../../js/util/database').db

const appList = {
  list: async () => {
    return db.appList.toArray()
  },
  add: async (appList) => {
    db.appList.put(appList)
  },
  convertTreeNode: (appList) => {
    let item = {}
    item.title = appList.name
    item.key = 'myapp_' + appList.id
    item.slots = {
      icon: 'list-icon'
    }
    return item
  },
  put:async(data)=>{
    db.appList.put(data)
  }
}

module.exports = appList
