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
      tb: {
        nickname: null,
        order: {
          orders: [],
        }
      },
      jd: {
        nickname: null,
        order: {
          orders: [],
          parentOrders: []
        }
      }
    },
    currentDetail:{},//当前定位到的详情订单
    courierDetailList: [],
    // 大尺寸下查看内容详情，传递快递单号
    viewCourierDetail: ''
  }),
  actions: {
    // 根据订单号来存储快递数据
    async putCourierInfo(code: any, order: any, customerName: any) {
      //console.log('查看情况',code,order);
      const option = {
        shipperCode: code,
        logisticCode: order,
        customerName: customerName
      }
      // console.log('查看option',option);
      let response = await post(kdniao, option)
      console.log('添加数据',response)
      // console.log('查看报错信息',response);
      if(response.Success){
        //更详细的监测
        let now=Date.now()
        const dbData = {
          _id: `courier:${now}`,
          content: response,
          title:response.LogisticCode.slice(0, 4)+'-'+response.LogisticCode.slice(0, 4).slice(-4),
          category: `courier:${now}`,
          createTime: now,
          updateTime: now
        }
        // console.log('查看db存储的数据',dbData);
        let rs = await tsbApi.db.put(dbData)
        console.log('添加结果',rs)
        if(rs.ok){
          return rs.docs
        }else{
          this.getDbCourier();
          return false
        }

      }
      // const res  = await tsbApi.db.put(dbData)
      // console.log('查看结果',res);
    },

    // 获取db中存储的快递数据
    async getDbCourier() {
      const getResult = await tsbApi.db.allDocs('courier:')
      const rowList = getResult.rows
      // 将getResult.rows列表的doc进行解构
      const docList = rowList.map((item: any) => {
        return item.doc
      })
      // 将docList中的content进行解构
      const contentList = docList.map((item: any) => {
        return item
      })
      let  filterList = contentList.filter((item: any) => {
        // console.log('查看',item.Traces.length);
        // if(item.Traces.length !== 0){
        //   return item
        // }
        return item
      })
      filterList=filterList.sort((item1,item2)=>{
        return item2.createTime-item1.createTime
      })
      // console.log('获取列表中的doc',filterList);
      this.courierDetailList = filterList
    },

    // 删除db中存储的数据
    async removeDbData(item) {
      // console.log('查看下标::>>',index);

      const res = await tsbApi.db.remove(item)
      // console.log('查看删除结果',res);
      this.getDbCourier()
    },

    // 刷新快递信息
    async refreshCouriers() {
      if (this.courierDetailList.length > 0) {
        let data = this.courierDetailList.map((item) => {
          return {
            code: item.ShipperCode,
            order: item.LogisticCode,
            customerName: item.customerName ? item.customerName : '',
          };
        });
        for(const item of this.courierDetailList){
          if(item.store){
            continue //商城订单不走这个
          }
          let res = await post(kdniao, {
            shipperCode: item.code,
            logisticCode: item.order,
            customerName: item.customerName,
          });
          if(res.Success){
            //如果成功获取到快递鸟信息了
            await this.updateDbItem({
              ...item,
              content:res
            })
          }

        }
        const getResult = await tsbApi.db.allDocs('courier:');
        const rowList = getResult.rows;
        const docList = rowList.map((item) => item.doc);
        this.getDbCourier();
      }
    },

    /**
     * 更新数据库内容
     * @param newData
     */
    async  updateDbItem(newData){
      let found=await tsbApi.db.find(
        {
          selector: {
            id: newData.id,
          }
        })
      if(found?.docs?.length)
      {
        delete newData._rev
        let data={
          ...found?.docs[0],
          ...newData
        }
        console.log(data,'要更新')
       return  await tsbApi.db.put(data); // 更新文档
      }else{
        return false
      }
    },

    // 将排序后的数据进行存储
    putSortList(list: any) {
      this.courierDetailList = list
    },

    /**
     * 保存、更新京东订单
     * @param orderInfo
     */
    async saveJdOrders(orderInfo) {
      await tsbApi.db.createIndex({
        index: {
          fields: ['store', 'orderId']
        }
      })
      let updateCount = 0

      if (orderInfo.orders) {
        orderInfo.orders=orderInfo.orders.reverse()
        for (const order of orderInfo.orders) {
          let found = await tsbApi.db.find({
            selector: {
              _id: {
                $regex: new RegExp(`^courier:`)
              },

              store: "jd",
              orderId: order.id,
            },
          })

          function mapData(order) {
            let data = {
              content: order,
              title: order?.items[0].name,
              cover: order?.items[0].cover,
              orderId: order.id,
              store: 'jd',
              updateTime: Date.now()
            }
            return data
          }


          if (found.docs?.length) {
            //更新流程
            console.log(found)
            let foundOrder = found.docs[0]
            foundOrder = {
              ...foundOrder,
              ...mapData(order)
            }

            let putRs = await tsbApi.db.put(foundOrder)
            if (putRs.ok) {
              updateCount++
            }

          } else {
            let now = Date.now()
            const dbData = {
              ...mapData(order),
              _id: `courier:${now}`,
              createTime: now,
              category: `courier:${now}`,
            }
            let addRs = await tsbApi.db.put(dbData)
            console.log('插入结果', addRs)
            if (addRs?.ok) {
              updateCount++
            }
          }
        }
      }

      return updateCount


    }


  },
  persist: {
    enabled: true,
    strategies: [
      {
        storage: dbStorage,
        paths: ['courierMsgList', 'storeInfo','currentDetail'],
      }
    ]
  }
})
