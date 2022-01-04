// desk存在以下几种数据类型
// deskId  整数型，一般是创建时间
// deskInfo  存储桌面的信息，例如
// {
//   "icon": "book",
//   "name": "新桌面32",
//   "id": 1640843541303,
//   "layout": [],
//   "createTime": 1640843541303,
//   "updateTime": 1641286442216
// }
// deskLayout 复杂的结构，详见api文档
const deskModel={
 // livingNewtabUUID:'livingNewtabUUID',//uuid方式已废弃
  selectedDesk:'selectedDesk',
  saveAll(desks){
  },
  getCurrentDeskLayout(){
    let currentDesk=deskModel.getCurrentDeskId()
    return deskModel.getDeskLayout(currentDesk)
  },
  getCurrentDeskId(){
    let currentDesk=localStorage.getItem(deskModel.selectedDesk)
    if(!!!currentDesk){
      currentDesk=0
    }
    return currentDesk
  },
  /**
   * 获取当前桌面的信息
   */
  getCurrentDeskInfo(){
    return deskModel.getDeskInfo(deskModel.getCurrentDeskId())
  },
  getDeskLayout(deskId){
    let desk=[]
    try{
      desk=JSON.parse(localStorage.getItem('desk_'+deskId.toString()))
    }catch (e){
      console.log(e)
    }
    return  desk
  },
  getDeskInfo(id){
    let desks=deskModel.getAllDeskInfo()
    let deskInfo={}
    desks.forEach((item)=>{
      if(Number(item.id)===Number(id)){
        deskInfo=item
      }
    })
    return deskInfo
  },
  getAllDeskInfo(){
    let desks=[]
    try{
     desks= JSON.parse(localStorage.getItem('desks'))
    }catch (e){
      console.log(e)
    }
    if(desks.length===0){
      localStorage.setItem('desks',JSON.stringify([]))
      //desks不存在,则初始化一个空对象
    }
    return desks
  },
  saveAllDeskInfo(allDeskInfo){
    localStorage.setItem('desks',JSON.stringify(allDeskInfo))
  },
  updateDeskInfo(id,deskInfo){
    let desks=deskModel.getAllDeskInfo()
    for(let i=0;i<desks.length;i++){
      if(desks[i].id===deskInfo.id){
        deskInfo.updateTime=Date.now()
        desks[i]=deskInfo
      }
    }
    deskModel.saveAllDeskInfo(desks)
  },
  /**
   * 刷新一个桌面的最后更新时间
   * @param id
   */
  refreshDeskInfoUpdateTime(id){
    deskModel.updateDeskInfo(id,deskModel.getDeskInfo(id))//更新一下deskInfo最后更新时间
  },
  /**
   * 更新一个桌面的布局
   * @param id 桌面id
   * @param layout 布局数据
   */
  updateDeskLayout(id,layout){
    localStorage.setItem('desk_'+id.toString(),JSON.stringify(layout))
    deskModel.refreshDeskInfoUpdateTime(id)//刷新一下桌面更新时间
    localStorage.setItem(deskModel.livingNewtabUUID,deskModel.generateUUID())//重新生成uuid，代表已变更
  },
  /**
   * 生成一个uuid
   */
  generateUUID(){
    var d = new Date().getTime();
    if (window.performance && typeof window.performance.now === "function") {
      d += performance.now(); //use high-precision timer if available
    }
    var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
    return uuid;
  },
  addElementToDesk(element,deskId){
    let desk=deskModel.getDeskLayout(deskId)
    desk.push(element)
    deskModel.updateDeskLayout(deskId,desk)
  },
  /**
   * 创建一个桌面元素用于添加
   * @param element 元素，形如{type:'app',data:app}
   * @param posElement 位置属性，形如{x,y,w,h,i}
   * @returns {{w, x: number, h, y: number, i: number, isResizable: *}}
   */
  createElementPos(element, posElement = null){
    const sizes = {
      card: {
        w: 2, h: 1,
        isResizable: true,
        dragIgnoreFrom: 'textarea'
      },
      app: {
        w: 1, h: 1,
        isResizable: false,
      },
      group: {
        w: 1, h: 1,
        isResizable: false,
        dragIgnoreFrom: '.group-icons'
      },
      clock: {},
      search: {
        w: 4, h: 1,
        isResizable: true,
      },
      video:{
        w:2,h:1,
        isResizable:true,
      }
    }

    const pos = {
      x: 0,
      y: 0, // puts it at tselectedElements bottom
      w: sizes[element.type].w,
      h: sizes[element.type].h,
      i: Date.now(),
      //dragIgnoreFrom: !!!sizes[element.type].dragIgnoreFrom ? 'button,a' : sizes[element.type].dragIgnoreFrom,

      isResizable: sizes[element.type].isResizable
    }
    if (posElement !== null) {
      Object.assign(pos, posElement)
    }
    pos.element = element
    return pos
  }
}

module.exports=deskModel
