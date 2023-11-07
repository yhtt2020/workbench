import {defineStore} from "pinia";
import dbStorage from "./dbStorage";
import {sUrl} from "../consts";
import {post} from "../js/axios/kdniaoPost";
import {localCache} from '../js/axios/serverCache'

const kdniao = sUrl('/app/kdniao/realTimeQuery')

// @ts-ignore
export const courierStore = defineStore("courier", {
    state: () => ({
      storeInfo: {
        tb:{
          nickname:null,
          order:{
            orders:[],
          }
        },
        jd:{
          nickname:null,
          order:{
            orders:[],
            parentOrders:[]
          }
        }
      },
        courierMsgList: [],
        courierDetailList: [],
        couriersDetailMsg:[],
        // 大尺寸下查看内容详情，传递快递单号
        viewCourierDetail:''
    }),
    actions: {
        // addCourierEvent(event){
        //     this.courierDetailList.push(event)
        // },
        // removeCourierEvent(event){
        //     this.courierDetailList=this.courierDetailList.filter(item=>{
        //         return item.shipperCode!=event.shipperCode && item.logisticCode!=event.logisticCode
        //     })
        // },

        // 根据订单号来存储快递数据
        
        async putCourierInfo(code:any,order:any,customerName:any){
          //   console.log('查看情况',code,order);
          const option = {
            shipperCode:code,
            logisticCode: order,
            customerName:customerName
          }
          // console.log('查看option',option);
          

          let response = await post(kdniao, option)
          console.log('查看报错信息',response);
          

          const dbData = {
            _id:`courier:${Date.now()}`,
            content:response,
            category:`courier:${Date.now()}`,
            createTime:Date.now(),
            updateTime:Date.now()
          }
          console.log('查看db存储的数据',dbData);
          await tsbApi.db.put(dbData)
          // const res  = await tsbApi.db.put(dbData)
          // console.log('查看结果',res);
          this.getDbCourier();
        },

        // 获取db中存储的快递数据
        async getDbCourier(){
          const getResult  = await tsbApi.db.allDocs('courier:')
          const rowList = getResult.rows
          // 将getResult.rows列表的doc进行解构
          const docList = rowList.map((item:any)=>{ return item.doc }) 
          // 将docList中的content进行解构
          const contentList = docList.map((item:any)=>{ return item.content})
          const filterList = contentList.filter((item:any)=>{
            // console.log('查看',item.Traces.length);
            // if(item.Traces.length !== 0){
            //   return item
            // }
            return item
          })
          // console.log('获取列表中的doc',filterList);
          this.courierDetailList = filterList
        },

        // 删除db中存储的数据
        async removeDbData(index:any){  
          console.log('查看下标::>>',index);
          const getResult  = await tsbApi.db.allDocs('courier:')
          const rowList = getResult.rows
          // 将getResult.rows列表的doc进行解构
          const docList = rowList.map((item:any)=>{ return item.doc }) 
          console.log('查看需要删除的doc', docList[index]);
          
          const res = await tsbApi.db.remove(docList[index])
          // console.log('查看删除结果',res);
          this.getDbCourier()
        },

        // 刷新快递信息
        // async refreshCouriers(){
        //   if(this.courierDetailList.length>0){
        //     let data=this.courierDetailList.map((item)=>{
        //       return {code:item.ShipperCode,order:item.LogisticCode,customerName:item.customerName?item.customerName:''}
        //     })
        //     console.log(data);
        //     data.forEach(async(item,index)=>{
        //         // await this.putCourierInfo(item.code,item.order,item.customerName)
        //         // console.log('删除的索引',index,item);
        //         // await this.removeDbData(index)

        //         let res=await post(kdniao,{
        //           shipperCode:item.code,
        //           logisticCode: item.order,
        //           customerName:item.customerName
        //         })
        //         const getResult  = await tsbApi.db.allDocs('courier:')
        //         const rowList = getResult.rows
        //         // 将getResult.rows列表的doc进行解构
        //         const docList = rowList.map((item:any)=>{ return item.doc }) 
        //         console.log(docList,'老数据');
                
        //         let newMsg=docList.filter((item)=>{
        //           if(item.content.ShipperCode===res.ShipperCode && item.content.LogisticCode === res.LogisticCode){
        //               return res
        //           }
        //         })
                
        //         console.log(JSON.stringify(newMsg))
        //         await tsbApi.db.put(JSON.stringify(newMsg))
        //         // const res  = await tsbApi.db.put(dbData)
        //         // console.log('查看结果',res);
        //         this.getDbCourier();
        //         // console.log(newMsg)
        //     })
        //     // for(let i=0;i<data.length;i++){
        //     //   this.putCourierInfo(data[i].code,data[i].order,data[i].customerName)
        //     //   // console.log(i)
        //     //   this.removeDbData(i)
        //     // }
            
          
            
        //   }
          
        // }
        async refreshCouriers() {
          if (this.courierDetailList.length > 0) {
            let data = this.courierDetailList.map((item) => {
              return {
                code: item.ShipperCode,
                order: item.LogisticCode,
                customerName: item.customerName ? item.customerName : '',
              };
            });
        
            data.forEach(async (item, index) => {
              let res = await post(kdniao, {
                shipperCode: item.code,
                logisticCode: item.order,
                customerName: item.customerName,
              });
        
              const getResult = await tsbApi.db.allDocs('courier:');
              const rowList = getResult.rows;
              const docList = rowList.map((item) => item.doc);
              // console.log(docList);
              
              let newMsg = docList.filter((doc) => {
                return doc.content.ShipperCode === res.ShipperCode && doc.content.LogisticCode === res.LogisticCode;
              });
              // console.log(newMsg[0].content,'newM');
              
              if (newMsg.length > 0) {
                // let changeRes='hhhh'
                // res.ShipperCode='SF'
                newMsg[0].content = res; // 更新 content 属性
                // console.log(newMsg[0].content,'New')
                await tsbApi.db.put(newMsg[0]); // 更新文档
              }
        
              this.getDbCourier();
            });
          }
        }
        


  },
  persist: {
    enabled: true,
    strategies: [
      {
        storage: dbStorage,
        paths: ['courierMsgList','storeInfo'],
      }
    ]
  }
})
