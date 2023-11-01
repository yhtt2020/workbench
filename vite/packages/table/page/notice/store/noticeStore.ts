import { defineStore } from "pinia";
import dbStorage from "../../../store/dbStorage";

//@ts-ignore
export const noticeStore = defineStore('notice',{
 state:()=>({
    detailList:[]
 }),
 
 actions:{
  // 获取db数据库中的数据
  async getNoticeList(){
    // console.log('读取存储数据');
    // const msgRes = await tsbApi.db.allDocs('weakMessage:')
    // const systemRes = await tsbApi.db.allDocs('weakSystem:')
    // const strongRes = await tsbApi.db.allDocs('strongSystem:')

    // 将数据多次转换成一次性请求,并且把数组进行解构
    
    const data = await Promise.all([
      ...(await tsbApi.db.allDocs('weakMessage:')).rows,
      ...(await tsbApi.db.allDocs('weakSystem:')).rows,
      ...(await tsbApi.db.allDocs('strongSystem:')).rows
    ])
    // console.log('返回数据',data);
    
    const mapData = data?.map((item)=>{
      return item.doc
    })
    // console.log('将数据进行拷贝修改',mapData);
    
    this.detailList = mapData
    
  },

  // 将忽略的消息通知进行数据库存储
  async putNoticeData(data:any,type:any){
    if(type === 'strong'){
    //  console.log('存储强通知数据',data);
    //  console.log('查看',data.type);
     
     const strongNotice = {
      _id:`strongNotice:${Date.now()}`,
      category:`strong:${Date.now()}`,
      content:{...data},
      createTime:Date.now(),
      updateTime:Date.now()
     }
    //  console.log('强消息通知',strongNotice);
     
    const res =  await  tsbApi.db.put(strongNotice)
    console.log('查看状态1',res);
    }else{
    //  console.log('存储弱消息通知数据',data);
    //  console.log('查看',data.type);

     if(data.type === 'message'){
      
      const weakMessageOption = {
        _id:`weakMessage:${Date.now()}`,
        category:`weak${Date.now()}`,
        content:{...data},
        createTime: Date.now(),
        updateTime:Date.now()
      }
      //  console.log('查看数据参数',weakMessageOption);
      const res =  await  tsbApi.db.put(weakMessageOption)
      console.log('查看状态2',res);
     }else{ 

      const weakSystemOption = {
        _id:`weakSystem:${Date.now()}`,
        category:`weak${Date.now()}`,
        content:{...data},
        createTime: Date.now(),
        updateTime:Date.now()
      }
      // console.log('查看数据结构',weakSystemOption);
      const res =  await tsbApi.db.put(weakSystemOption)
      console.log('查看状态3',res);
      
     }

    }
    this.getNoticeList()
  },

  // 将全部历史消息通知进行清除
  async delAllHistoryNotice(data:any){
    // console.log('全部清空',data);
    for(let i=0;i<this.detailList.length;i++){
      if(this.detailList[i].content.type === data){
        await tsbApi.db.remove(this.detailList[i])
        // const res =  await tsbApi.db.remove(this.detailList[i])
        // console.log('查看结果',res);
      }
    }
    this.getNoticeList()
  },

  // 将单个历史消息通知进行删除
  async delSingleHistoryNotice(item:any){
    await tsbApi.db.remove(item)
    this.getNoticeList()
  }




 },


 persist:{
  enabled: true,
  strategies: [{
   // 自定义存储的 key，默认是 store.$id
   // 可以指定任何 extends Storage 的实例，默认是 sessionStorage
   paths:[],
   storage: dbStorage,
   // state 中的字段名，按组打包储存
  }]
}
})

