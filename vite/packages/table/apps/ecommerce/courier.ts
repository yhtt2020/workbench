import {defineStore} from "pinia";
import dbStorage from "../../store/dbStorage";
import {sUrl} from "../../consts";
import {post} from "../../js/axios/kdniaoPost";
import {localCache} from '../../js/axios/serverCache'
import {generateTitle} from "../../components/widgets/courier/lib/courierTool";
import grab from "../../components/widgets/courier/lib/grab";
import courierUI from "../../components/widgets/courier/lib/courierUI";

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
    currentDetail: {},//当前定位到的详情订单
    orderList: [],//快递列表
    // 大尺寸下查看内容详情，传递快递单号
    viewCourierDetail: '',
    settings: {
      lastRefreshTime: '',
      courierSigned: { // 屏蔽快递已经签收的订单
        blockSigned: true,
        courierTime: '24小时'
      },

      courierStatus: { // 状态图标显示
        statusBar: true,
        currentStatus: 'unFinished',//followed,unFinished     //,'未完成快递'
      },

      courierRefresh: { // 开启自动订单数据自动刷新
        autoRefresh: true,
        autoTime: '30分钟'
      },
      // 开启快递单号匹配
      courierMatch: 'preciseMatch',
    },

  }),
  actions: {
    // 根据订单号来存储快递数据
    async putCourierInfo(shipperCode: any, logisticCode: any, customerName: any) {
      const option = {
        shipperCode: shipperCode,
        logisticCode: logisticCode,
        customerName: customerName
      }
      let response = await post(kdniao, option)
      if (response.Success) {
        //更详细的监测
        let now = Date.now()
        const dbData = {
          _id: `courier:${now}`,
          content: response,
          title: generateTitle(response),
          logisticCode: logisticCode,
          shipperCode: shipperCode,
          customerName: customerName,
          category: `courier:${now}`,
          createTime: now,
          updateTime: now
        }
        let rs = await tsbApi.db.put(dbData)
        if (rs.ok) {
          this.getDbCourier();
          return rs.docs
        } else {

          return false
        }

      }
    },

    async followCourier(id) {
      let courier = await this.findDbItem(id)
      if (courier) {
        courier.followed = true
      }
      let rs = await tsbApi.db.put(courier)
      if (rs.ok) {
        this.getDbCourier();
        return true
      } else {
        return false
      }
    },
    async hideCourier(id) {
      let courier = await this.findDbItem(id)
      if (courier) {
        courier.hide = true
      }
      let rs = await tsbApi.db.put(courier)
      if (rs.ok) {
        this.getDbCourier();
        return true
      } else {
        return false
      }
    },
    async showCourier(id) {
      let courier = await this.findDbItem(id)
      if (courier) {
        courier.hide = false
      }
      let rs = await tsbApi.db.put(courier)
      if (rs.ok) {
        await this.getDbCourier()
        return true
      } else {
        return false
      }
    },
    async clearDb() {
      const getResult = await tsbApi.db.find({
        selector: {
          _id: {
            $regex: new RegExp(`^courier:`)
          }
        }
      })
      if(getResult.docs){
        for(const doc of getResult.docs){
          await tsbApi.db.remove(doc)
        }
      }
      await this.getDbCourier()
      return true
    },
    /**
     * 置顶一个订单
     */
    async setTopCourier(id) {
      let courier = await this.findDbItem(id)
      if (courier) {
        await this.removeDbData(courier)
      }
      courier._id = 'courier:' + Date.now()
      courier.createTime = Date.now()
      courier.updateTime = Date.now()
      delete courier._rev
      let rs = await tsbApi.db.put(courier)
      if (rs?.ok) {
        await this.getDbCourier()
        return true
      } else {
        return false
      }

    },
    async unfollowCourier(id) {
      let courier = await this.findDbItem(id)
      if (courier) {
        courier.followed = false
      }
      let rs = await tsbApi.db.put(courier)
      if (rs.ok) {
        this.getDbCourier();
        return true
      } else {
        return false
      }

    },
    // 获取db中存储的快递数据
    async getDbCourier() {
      const getResult = await tsbApi.db.find({
        selector: {
          _id: {
            $regex: new RegExp(`^courier:`)
          },
          hide: {
            $ne: true
          }
        }
      })
      // 将getResult.rows列表的doc进行解构
      const docList = getResult.docs
      // 将docList中的content进行解构
      const contentList = docList.map((item: any) => {
        return item
      })
      let filterList = contentList.filter((item: any) => {
        // if(item.Traces.length !== 0){
        //   return item
        // }
        return item
      })
      let sortedList = filterList.sort((item1, item2) => {
        return item2.createTime - item1.createTime
      })
      this.orderList = [
        ...sortedList
      ]
    },

    // 删除db中存储的数据
    async removeDbData(item) {
      const rs = await tsbApi.db.remove(item)
      this.getDbCourier()
      return rs
    },
    async getHideList() {
      let rs=await tsbApi.db.find({
        selector: {
          _id: {
            $regex: new RegExp(`^courier:`)
          },
          hide: {
            $eq: true
          }
        }
      })
      return rs?.docs
    },
    async getHideCount() {
      let res = await this.getHideList()
      return res.length
    },
    async updateOrder(id) {
      let order = await this.findDbItem(id)
      if (order) {
        if (order.store === 'jd') {
          let promise=new Promise((resolve,reject)=>{
            grab.jd.getOrderDetail(order.content.detailUrl, async ({status, code, data}) => {
              if (status) {
                let content=order.content
                if(!content.detail) content.detail={}
                content.detail.expressNo = data.expressNo
                content.detail.traceNodes = data.traceNodes
                content.detail.expressType = data.expressType
                content.detail.updateTime = Date.now()
                content.latestNodes=content.detail.traceNodes
                let date=''
                //修复一下日期时间戳的显示问题
                for(const node of content?.latestNodes){
                  if(node.date){
                    date=node.date
                  }else{
                    node.date=date
                  }
                  node.time=node.date+' ' +node.time
                }
                const rs=await this.updateDbItem({
                  ...order,
                  content: content
                })
                resolve(order)
              } else {
                reject(false)
              }
            })
          })
          let rs= await promise
          return rs
        }
        else if(order.store === 'tb'){
          courierUI.updateTbOrder(order)
        }
        else{
          //快递鸟订单
          let res = await post(kdniao, {
            shipperCode: order.shipperCode,
            logisticCode: order.logisticCode,
            customerName: order.customerName,
          });
          if (res.Success) {
            //如果成功获取到快递鸟信息了
            const rs=await this.updateDbItem({
              ...order,
              content: res
            })
            return order
          }else{
            return false
          }
        }
      }else{
        return false
      }
    },

    // 刷新快递信息
    async refreshCouriers() {
      if (this.orderList.length > 0) {
        let data = this.orderList.map((item) => {
          return {
            code: item.ShipperCode,
            order: item.LogisticCode,
            customerName: item.customerName ? item.customerName : '',
          };
        });
        for (const item of this.orderList) {
          if (item.store) {
            continue //商城订单不走这个
          }
          let res = await post(kdniao, {
            shipperCode: item.shipperCode,
            logisticCode: item.logisticCode,
            customerName: item.customerName,
          });
          if (res.Success) {
            //如果成功获取到快递鸟信息了
            await this.updateDbItem({
              ...item,
              content: res
            })
          }

        }
        const getResult = await tsbApi.db.allDocs('courier:');
        const rowList = getResult.rows;
        const docList = rowList.map((item) => item.doc);
        await this.getDbCourier();
      }
    },

    /**
     * 根据id从数据库里取一个
     * @param id
     */
    async findDbItem(id) {
      let found = await tsbApi.db.find(
        {
          selector: {
            _id: id,
          }
        })
      if (found?.docs?.length) {
        return found?.docs[0]
      } else {
        return null
      }
    },

    /**
     * 更新数据库内容
     * @param newData
     */
    async updateDbItem(newData) {
      try {
        if (!newData._id) {
          return false
        }
        let found = await tsbApi.db.find(
          {
            selector: {
              _id: newData._id,
            }
          })
        if (found?.docs?.length) {
          delete newData._rev
          let data = {
            ...found?.docs[0],
            ...newData
          }
          let rs = await tsbApi.db.put(data); // 更新文档
          if (rs.ok) {
            await this.getDbCourier()
          }
          return rs.ok
        } else {
          return false
        }
      } catch (e) {
        console.error(e)
        return false
      }

    },

    // 将排序后的数据进行存储
    putSortList(list: any) {
      this.orderList = list
    },

    /**
     * 保存、更新京东订单
     * @param orderInfo
     */
    async saveJdOrders(orderInfo) {
      await tsbApi.db.createIndex({
        index: {
          fields: ['store', 'orderId', 'hide', 'followed']
        }
      })
      let updateCount = 0

      if (orderInfo.orders) {
        orderInfo.orders = orderInfo.orders.reverse()
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
              shipperCode: order.shipperCode,
              logisticCode: order.logisticCode,
              customerName: order.customerName,
              orderId: order.id,
              store: 'jd',
              updateTime: Date.now()
            }
            if (order.latestNodes?.length === 0 && order.detail?.traceNodes.length > 0) {
              let date = ''
              order.latestNodes = order.detail.traceNodes.map(i => {
                if (i.date) {
                  date = i.date
                }
                return {
                  time: date + ' ' + i.time,
                  txt: i.txt
                }
              })

            }
            return data
          }


          if (found.docs?.length) {
            //更新流程
            let mapped = mapData(order)
            let foundOrder = found.docs[0]
            foundOrder = {
              ...foundOrder,
              ...mapped,
              title: foundOrder.edited ? foundOrder.title : mapped.title//单独处理title
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
              title: order.items[0].name,
              shipperCode: order.shipperCode,
              logisticCode: order.logisticCode,
              customerName: order.customerName,
              category: `courier:${now}`,
            }
            let addRs = await tsbApi.db.put(dbData)
            if (addRs?.ok) {
              updateCount++
            }
          }
        }
      }

      return updateCount


    },
    /**
     * 保存、更新淘宝订单
     * @param orderInfo
     */
    async saveTbOrders(orders) {
      await tsbApi.db.createIndex({
        index: {
          fields: ['store', 'orderId', 'hide', 'followed']
        }
      })
      let dbOrders=[]
      if (orders) {
        orders = orders.reverse()

        for (const order of orders) {
          let found = await tsbApi.db.find({
            selector: {
              _id: {
                $regex: new RegExp(`^courier:`)
              },
              store: "tb",
              orderId: order.id,
            },
          })

          function mapData(order) {
            let data = {
              content: order,
              title: order?.items[0].name,
              cover: order?.items[0].cover,
              shipperCode: order.shipperCode,
              logisticCode: order.logisticCode,
              customerName: order.customerName,
              orderId: order.id,
              store: 'tb',
              updateTime: Date.now()
            }
            if (order.latestNodes?.length === 0 && order.detail?.traceNodes.length > 0) {
              let date = ''
              order.latestNodes = order.detail.traceNodes.map(i => {
                if (i.date) {
                  date = i.date
                }
                return {
                  time: date + ' ' + i.time,
                  txt: i.txt
                }
              })

            }
            return data
          }
          if (found.docs?.length) {
            //更新流程
            let mapped = mapData(order)
            let foundOrder = found.docs[0]
            foundOrder = {
              ...foundOrder,
              ...mapped,
              title: foundOrder.edited ? foundOrder.title : mapped.title//单独处理title
            }

            let putRs = await tsbApi.db.put(foundOrder)
            if (putRs.ok) {
              dbOrders.push({
                ...foundOrder
              })
            }

          } else {
            let now = Date.now()
            const dbData = {
              ...mapData(order),
              _id: `courier:${now}`,
              createTime: now,
              title: order.items[0].name,
              shipperCode: order.shipperCode,
              logisticCode: order.logisticCode,
              customerName: order.customerName,
              category: `courier:${now}`,
            }
            let addRs = await tsbApi.db.put(dbData)
            if (addRs?.ok) {
              dbOrders.push({
                _id:addRs.id,
                ...dbData
              })
            }
          }
        }
      }
      return dbOrders
    }


  },
  persist: {
    enabled: true,
    strategies: [
      {
        storage: localStorage,
        paths: ['courierMsgList', 'storeInfo', 'currentDetail', 'orderList', 'settings'],
      }
    ]
  }
})
