db = require('../../../js/util/database').db

const appListModel = {
  list: async (list={id:0}) => {
    let lists= await db.appList.where("parentId").anyOf(list.id).sortBy('sort')
    let childTreeList= []
    lists.forEach(async (childList)=>{
      childList.children= await appListModel.list(childList)
      childTreeList.push(appListModel.convertTreeNode(childList))
    })
    return childTreeList
  },
  add: async (appList) => {
    return await db.appList.put(appList)
  },
  moveAppListToList(moveItemId,toParentId=0){
    if(toParentId==="myapp"){
      toParentId=0
    }
    db.appList.update({id:moveItemId},{parentId:toParentId})
  },
  convertTreeNode: (appList) => {
     //console.log(appList, 'woxianzai yao de ')
    let item = {}
    item.title = appList.name
    item.key =  Number(appList.id)
    item.slots = {
      icon: 'list-icon'
    }
    item.children= appList.children
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
    //todo 将被删除的列表里的导航移动到默认列表
  },
  getIdFromTreeKey(treeKey){
    return treeKey
  },
  //创建默认列表面包屑
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

  },
  //将树状结构存储回数据库
  saveTree(data,parentId=0,sort=0,path="0"){
    if(data.key==='myapp'){
      //data没有key，所以是根路径
      data.key=0
    }else{
      path+='-'+data.key  //拼接路径
    }
    console.log(data)
    console.log(path)
    console.log('parentid='+parentId)
    const newItem={
      parentId:parentId,
      path:path,
      sort:sort
    }
    console.log(newItem)
    //todo 更新
    if(data.key!==0){
      db.appList.update(data.key,newItem)
    }

    if(data.children.length>0){
      //如果存在子元素，则将子元素递归保存进去
      for(let i=0;i<data.children.length;i++){
        appListModel.saveTree(data.children[i],data.key,i,path)
      }
    }
  },

  /**
   * 移动一批应用到某个列表
   * @param appsIds 应用id数组
   * @param listId 列表id
   */
  async moveAppsToList (appsIds,listId){
    appsIds.forEach((app,index)=>{
      appsIds[index]=Number(app)
    })
   const apps=await db.myApps.bulkGet(appsIds)
    apps.forEach((newApp)=>{
      newApp.listId=listId
    })
    return await db.myApps.bulkPut(apps,{allKeys: true})
  }
}
const treeUtil={
  getIdFromTreeKey(treeKey,type){
    return treeKey.replace(type,'')
  },
  findTreeNode(findKey,treeList){
    let key=-1
    let findedList={}
    for(let i=0;i<treeList.length;i++){
      if(Number(treeList[i].key)===Number(findKey)){
        console.log('find')
        findedList=treeList[i]
        key=treeList[i].key
        break
      }
      if(!!treeList[i].children){
        const result=treeUtil.findTreeNode(findKey,treeList[i].children)
        if(result.key>-1){
          //如果其children找到了这个列表，则直接返回找到的
          findedList=result.list
          key=result.key
          break
        }
      }
    }


    //如果本层级也没找到这个则，返回失败
    if(key===-1){
      return {list:null,key:-1}
    }else{
      return { list:findedList,key:key }
    }

  }
}
module.exports = { appListModel , treeUtil }
