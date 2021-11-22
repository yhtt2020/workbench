db = require('../../js/util/database').db

const appList = {
  list: async () => {
    return db.appList.toArray()
  },
  add: async (appList) => {
    return await db.appList.put(appList)
  },
  convertTreeNode: (appList) => {
    let item = {}
    item.title = appList.name
    item.key =  Number(appList.id)
    item.slots = {
      icon: 'list-icon'
    }
    return item
  },
  put:async(data)=>{
    return await db.appList.put(data)
  },
  delete:async(id)=>{
    db.appList.delete(id)
  },
  getIdFromTreeKey(treeKey){
    return treeKey
  }
}
const treeUtil={
  getIdFromTreeKey(treeKey,type){
    return treeKey.replace(type,'')
  },
  findTreeNode(treeKey,treeList){
    let list=null
    let key=-1
    treeList.forEach((item,index)=>{
      if(item.key===treeKey){
        list=item
        key=index
      }
    })
    return {list,key}
  }
}
module.exports = {appList,treeUtil}
