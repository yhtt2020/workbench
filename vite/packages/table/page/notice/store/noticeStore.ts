import {defineStore} from "pinia";
import {sUrl} from "../../../consts";
import dbStorage from "../../../store/dbStorage";
import {post} from '../../../js/axios/request'
//@ts-ignore
export const noticeStore = defineStore('notice', {
  state: () => ({
    detailList: [],
    // 发送消息配置
    msgSetting:{
      title:'', // 标题
      summary:'', // 摘要
      content:'测试', // 正文
      noticeType:'1', // 消息类型
      cover:[], // 封面
      urls:[], //  按钮链接
      videos:[],// b站视频链接
      attachments:[], //附件
      targetType: { name:'全员',value:1000 },

    },
  }),

  actions: {
    // 获取db数据库中的数据
    async getNoticeList() {
      // console.log('读取存储数据');
      // const msgRes = await tsbApi.db.allDocs('weakMessage:')
      // const systemRes = await tsbApi.db.allDocs('weakSystem:')
      // const strongRes = await tsbApi.db.allDocs('strongSystem:')

      // 将数据多次转换成一次性请求,并且把数组进行解构
      this.delAllHistoryNotice()
      let rs = await tsbApi.db.find({
        selector: {
          _id: {
            $regex: new RegExp(`^message:`)
          },
        }
      })
      let list:any = []
      if (rs.docs) {
        list = rs.docs
      } else {
        list = []
      }
      // console.log('返回数据',data);


      const onlineNoticeRs = await post(sUrl('/app/notice/getList'), {
        page: 1
      })

      if (onlineNoticeRs.status) {
        let onlineNotices:any = []
        console.log(onlineNoticeRs,'list')
        for (const notice of onlineNoticeRs.data.list) {
          let has = list.some((li:any) => {
            return li.content.id === notice.id
          })
          if (!has) {
            const convertedData:any =window.$notice._convertNoticeMsg(notice)
            onlineNotices.push({
              ...convertedData,
              type:convertedData.type,
              noticeType:notice.noticeType
            })
            this.putMessageData(window.$notice._convertNoticeMsg(notice),notice.noticeType)
          }
        }
        console.log(onlineNotices,'onlineNotices')

        let onlineNotice =
          list = [
            ...list,
            ...onlineNotices
          ]
      }
      // console.log('将数据进行拷贝修改',mapData);

      const sortData = list.sort((a: any, b: any) => {
        return b.createTime - a.createTime
      })

      // console.log('查看排序后的消息列表',sortData);


      console.log(sortData)
      this.detailList = sortData

    },

    // 将忽略的消息通知进行数据库存储
    async putMessageData(data: any, type: any) {
      const message = {
        _id: `message:${Date.now()}`,
        type: data.type,
        noticeType: type,
        content: {...data},
        createTime: Date.now(),
        updateTime: Date.now()
      }
      console.log('写入数据',message)
      await tsbApi.db.put(message)
      await this.getNoticeList()
    },

    // 将全部历史消息通知进行清除
    async delAllHistoryNotice(type: any) {
      // console.log('查看列表',this.detailList);
      // console.log('查看type',type);
      const data = await Promise.all([
        ...(await tsbApi.db.allDocs('weakMessage:')).rows,
        ...(await tsbApi.db.allDocs('weakSystem:')).rows,
        ...(await tsbApi.db.allDocs('strongNotice:')).rows
      ])
      console.log('老的残余数据', data)
      for (const item of data) {
        await tsbApi.db.remove(item.doc)
        // console.log('查看item',item);
        // const itemType = item.content.type  // 根据左侧tab切换类型来将数据进行删除
        // if(type === itemType){
        // }
      }


    },

    /**
     * 新的清空方法，弃用老方法
     */
    async clear() {
      let rs = await tsbApi.db.find({
        selector: {
          _id: {
            $regex: new RegExp(`^message:`)
          },
        }
      })
      let list = []
      if (rs.docs) {
        list = rs.docs
      } else {
        list = []
      }

      for(const li of list){
        await tsbApi.db.remove(li)
      }
      this.getNoticeList()
    },

    // 将单个历史消息通知进行删除
    async delSingleHistoryNotice(item: any) {
      console.log(item)
      await tsbApi.db.remove(item)
      await this.getNoticeList()
    },

    // 创建一个推送消息
    async createNotice(){
      console.log('执行....测试-1',{
        title:this.msgSetting.title,
        cover:JSON.stringify(this.msgSetting.cover),
        videos:JSON.stringify(this.msgSetting.videos),
        urls:JSON.stringify(this.msgSetting.urls),
        content:this.msgSetting.content,
        summary:this.msgSetting.summary,
        noticeType:this.msgSetting.noticeType,
        attachments:JSON.stringify(this.msgSetting.attachments),
        targetType:this.msgSetting.targetType,
      });
      
    }

  },


  persist: {
    enabled: true,
    strategies: [{
      // 自定义存储的 key，默认是 store.$id
      // 可以指定任何 extends Storage 的实例，默认是 sessionStorage
      paths: ['msgSetting'],
      storage: dbStorage,
      // state 中的字段名，按组打包储存
    }]
  }
})

