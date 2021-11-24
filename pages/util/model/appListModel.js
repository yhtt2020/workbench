db = require('../../../js/util/database').db

const appListModel = {
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
  get:async(id)=>{
    return await db.appList.get(id)
  },
  delete:async(id)=>{
    db.appList.delete(id)
  },
  getIdFromTreeKey(treeKey){
    return treeKey
  },
  getDefaultList: ()=>{
      const  result=  db.system.where({'name':"myappDefault"}).first()
       if(!!!result){
         return null
       }else{
         return result
       }

  },
  putDefaultList(newData){
     db.system.where({'name':"myappDefault"}).first().then(data=>{
       if(!!!data){
         return db.system.put({'name':"myappDefault",'value':newData})
       }else{
         data.value=newData
         return db.system.put(data)
       }
     })

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
module.exports = { appListModel , treeUtil }
