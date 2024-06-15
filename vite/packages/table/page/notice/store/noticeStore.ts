import { defineStore } from "pinia";
import { sUrl } from "../../../consts";
import dbStorage from "../../../store/dbStorage";
import { post } from "../../../js/axios/request";
import { message } from "ant-design-vue";

const addNotice = sUrl("/app/notice/add"); // 创建消息
const sendNotice = sUrl("/app/notice/startPush"); // 推送消息
const deleteNotice = sUrl("/app/notice/delete"); // 删除消息

// 初始化编辑数据
const initMsgSetting = {
  title: "", // 标题
  summary: "", // 摘要
  content: "", // 正文
  noticeType: 1, // 消息类型
  covers: [], // 封面
  urls: [], //  按钮链接
  videos: [], // b站视频链接
  attachments: [], //附件
  targetType: 1000,
  targetList: [], // 选中的用户
  sendTime: new Date().getTime(), // 发送时间
};

//@ts-ignore
export const noticeStore = defineStore("notice", {
  state: () => ({
    detailList: [],
    // 发送消息配置
    msgSetting: {
      title: "", // 标题
      summary: "", // 摘要
      content: "", // 正文
      noticeType: 1, // 消息类型
      covers: [], // 封面
      urls: [], //  按钮链接
      videos: [], // b站视频链接
      attachments: [], //附件
      targetType: 1000,
      targetList: [], // 选中的用户
      sendTime: new Date().getTime(), // 发送时间
    },
    // 草稿箱
    draftBox: [],
    // 单个详情数据
    detailItem: {},
  }),

  actions: {
    // 获取db数据库中的数据
    async getNoticeList() {
      let rs = await tsbApi.db.find({
        selector: {
          _id: {
            $regex: new RegExp(`^message:`),
          },
        },
      });
      let list: any = [];
      if (rs.docs) {
        list = rs.docs;
      } else {
        list = [];
      }

      // 在线推送消息请求
      const onlineNoticeRs = await post(sUrl("/app/notice/getList"), {
        page: 1,
      });
      if (onlineNoticeRs.status) {
        let onlineNotices: any = [];
        // 判断onlineNoticeRs.data.list是否为null,处理报错问题
        if (onlineNoticeRs?.data?.list) {
          for (const notice of onlineNoticeRs?.data?.list) {
            let has = list.some((li: any) => {
              return li.content.id === notice.id;
            });
            if (!has) {
              const convertedData: any = (
                window as any
              ).$notice._convertNoticeMsg(notice);
              const pushOption = {
                ...convertedData,
                type: convertedData?.type,
                noticeType: notice?.noticeType,
              };
              onlineNotices.push(pushOption);
              this.putMessageData({ ...convertedData }, notice?.noticeType);
            }
          }
        }
        list = [...list, ...onlineNotices];
      }

      // 根据时间戳进行排序
      const sortData = list.sort((a: any, b: any) => {
        return b.createTime - a.createTime;
      });
      this.detailList = sortData;
    },

    // 将忽略的消息通知进行数据库存储
    async putMessageData(data: any, type: any) {
      const time = data?.time;
      const message = {
        _id: `message:${time}`,
        type: data.type,
        noticeType: type,
        content: { ...data },
        createTime: time,
        updateTime: time,
      };

      await tsbApi.db.put(message);
      await this.getNoticeList();
    },

    // 新的清空方法，弃用老方法
    async clear() {
      let rs = await tsbApi.db.find({
        selector: {
          _id: {
            $regex: new RegExp(`^message:`),
          },
        },
      });

      let list: any = [];
      if (rs.docs) {
        list = rs.docs;
      } else {
        list = [];
      }

      for (const li of list) {
        await tsbApi.db.remove(li);
      }
      message.success("已为您清空本地消息（不包含推送等网络消息）");

      // 做刷新操作
      setTimeout(()=>{
        this.getNoticeList();
      },500);
    },

    // 清空指定的历史消息通知
    async clearSpecifyHistory(item: any) {
      await tsbApi.db.remove(item);
      await this.getNoticeList();
    },

    // 删除推送消息
    async removePushMsg(data: any) {
      await tsbApi.db.remove(data);
      await post(deleteNotice, { id: String(data?.content?.id) });
      await this.getNoticeList();
    },

    // 清空编辑数据
    initMsgData() {
      this.msgSetting = initMsgSetting;
    },

    // 将编辑好消息发送出去
    async pushNoticeMsg(id: any) {
      const res = await post(sendNotice, { noticeId: `${id}` });
      if (res.status === 1) {
        this.initMsgData();
        const index = this.draftBox.findIndex((find: any) => {
          return Number(find.id) === Number(id);
        });
        this.draftBox.splice(index, 1);
        this.getNoticeList();
        return res;
      }
    },

    // 创建一个推送消息
    async createNotice() {
      const option = {
        title: this.msgSetting.title,
        covers: JSON.stringify(this.msgSetting.covers),
        videos: JSON.stringify(this.msgSetting.videos),
        urls: JSON.stringify(this.msgSetting.urls),
        content: this.msgSetting.content,
        summary: this.msgSetting.summary,
        noticeType: this.msgSetting.noticeType,
        attachments: JSON.stringify(this.msgSetting.attachments),
        targetType: this.msgSetting.targetType,
        targetList: JSON.stringify(this.msgSetting.targetList),
        sendTime: `${this.msgSetting.sendTime}`,
      };
      // console.log('排查',option);
      const res = await post(addNotice, option);
      if (res.status === 1) {
        const index = this.draftBox.findIndex((find: any) => {
          return Number(find.id) === Number(res.data.id);
        });
        if (index === -1) {
          this.draftBox.push(res.data);
          this.msgSetting = initMsgSetting;
        }
        return res.data.id;
      }
    },


  },

  persist: {
    enabled: true,
    strategies: [
      {
        // 自定义存储的 key，默认是 store.$id
        // 可以指定任何 extends Storage 的实例，默认是 sessionStorage
        paths: ["msgSetting", "draftBox", "detailItem"],
        storage: dbStorage,
        // state 中的字段名，按组打包储存
      },
    ],
  },
});
