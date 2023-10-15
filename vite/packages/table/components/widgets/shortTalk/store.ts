import {defineStore} from "pinia";
import dbStorage from "../../../store/dbStorage";
import cache from "../../../components/card/hooks/cache";
import { cardStore } from '../../../store/card';
import {mapActions, mapState,mapWritableState} from "pinia";
import { post } from "../../../js/axios/request"
import { useToast } from "vue-toastification";
const toast = useToast()
// @ts-ignore
export const shortTalkStore = defineStore("shortTalkStore", {
  state: () => ({
    // 密钥
    access_token:'',
    // 请求地址
    baseUrl:'',
    // 社区访问数据 含平台
    access:{},
    // 社区互动数据
    interact:{},
    // 社区数据
    mockData:[
      {
          key: 1,
          title: "今日发布",
          type:'today_thread',
          num:'',
      },
      {
          key: 2,
          title: "今日评论",
          type:'today_post',
          num:'',
      },
      {
          key: 3,
          title: "今日点赞",
          type:'today_support',
          num:'',
      },
      {
          key: 4,
          title: "今日注册",
          type:'today_register',
          num:'',
      },
      {
          key: 5,
          title: "今日访问",
          type:'today_visit',
          num:'',
      },
      {
          key: 6,
          title: "本周发布",
          type:'week_thread',
          num:'',
      },
      {
          key: 7,
          title: "本周评论",
          type:'week_post',
          num:'',
      },
      {
          key: 8,
          title: "本周点赞",
          type:'week_support',
          num:'',
      },
      {
          key: 9,
          title: "本周访问",
          type:'week_visit',
          num:'',
      },
      {
          key: 10,
          title: "本周注册",
          type:'week_register',
          num:'',
      },
      {
          key: 11,
          title: "本月发布",
          type:'month_thread',
          num:'',
      },
      {
          key: 12,
          title: "本月评论",
          type:'month_post',
          num:'',
      },
      {
          key: 13,
          title: "本月点赞",
          type:'month_support',
          num:'',
      },
      {
          key: 14,
          title: "本月注册",
          type:'month_register',
          num:'',
      },
      {
          key: 15,
          title: "本月访问",
          type:'month_visit',
          num:'',
      },
      {
          key: 16,
          title: "总访问数",
          type:'all_visit',
          num:'',
      },
      {
          key: 17,
          title: "总发布",
          type:'all_thread',
          num:'',
      },
      {
          key: 18,
          title: "总评论",
          type:'all_post',
          num:'',
      },
      {
          key: 19,
          title: "总点赞",
          type:'all_support',
          num:'',
      },
      {
          key: 20,
          title: "总注册",
          type:'all_register',
          num:'',
      },
      {
          key: 21,
          title: "我是标题",
          type:'today_thread',
          num:'',
      },
    ],
    // 待办数据
    todoList:[
      {
          title:"内容审核",
          type:'audit_thread',
          num:0,
      },
      {
          title:"评论审核",
          type:'audit_post',
          num:0,
      },
      {
          title:"频道推送审核",
          type:'audit_channel_post',
          num:0,
      },
      {
          title:"举报处理",
          type:'report',
          num:0,
      },
      {
          title:"版块访问审核",
          type:'audit_forum_member',
          num:0,
      },
      {
          title:"版块创建审核",
          type:'audit_forum',
          num:0,
      },
    ],
    // 设置状态存储
    setVisible:false,
  }),    
  // getters:{},
  actions: {
    // 处理请求地址
    qUrl(url){
      return this.baseUrl + url
    },
    
    // 初始化 图表 请求数据
    async getChartData(customData){
      if (customData.defaultPlatType) {
        await post( this.qUrl('/oauth/authorization/getCensus')+"?access_token=" + this.access_token,{
          "content":{
            "sign":"access,interact",
            "access":{
              "plate":customData.defaultPlatType.name,
              "day_type":customData.defaultTimeType.name,
              "start":customData.defaultTimeType.name == 'day'?this.getSevenDaysAgoTimestamp():customData.defaultTimeType.name=='week'?this.getSixWeeksAgoMondayTimestamp():this.getOneMonthAgoTimestamp(),
              "end":this.getYesterdayLastSecondTimestamp()
            },
              "interact":{
              "day_type":customData.defaultTimeType.name,
              "start":customData.defaultTimeType.name == 'day'?this.getSevenDaysAgoTimestamp():customData.defaultTimeType.name=='week'?this.getSixWeeksAgoMondayTimestamp():this.getOneMonthAgoTimestamp(),
              "end":this.getYesterdayLastSecondTimestamp()
            }
          }
        }).then((res)=>{
          this.access = res.access
          this.interact = res.interact
        })
      }else{
        // console.log('暂时没customData');
        
      }
    },
    // 初始化 数据板 请求数据
    async getBoardData(){
      await post( this.qUrl('/oauth/authorization/getCensus')+"?access_token=" + this.access_token,{
        "content":{
          "sign":"all_visit,week_thread,month_thread,all_thread,week_post,month_post,all_post,week_support,month_support,all_support,month_register,today_visit,week_visit,month_visit ,today_thread ,today_post,today_support,today_register,week_register,all_register",
          "access":{
            "plate":'all',
            "day_type":'month',
            "start":this.getOneMonthAgoTimestamp(),
            "end":new Date().getTime()/1000
          },
          "interact":{
            "day_type":'month',
            "start":this.getOneMonthAgoTimestamp(),
            "end":new Date().getTime()/1000
          }
        }
      }).then((res)=>{
        this.mockData.forEach(item => {
          item.num = res[item.type]
        });
      })
    },
    // 初始化 待办 请求数据
    async getTodoData(){
      await post( this.qUrl('/oauth/authorization/getCensus')+"?access_token=" + this.access_token,{
        "content":{
          "sign":"audit_thread,audit_post,audit_channel_post,report,audit_forum_member,audit_forum",
          "access":{
            "plate":'all',
            "day_type":'month',
            "start":this.getOneMonthAgoTimestamp(),
            "end":new Date().getTime()/1000
          },
          "interact":{
            "day_type":'month',
            "start":this.getOneMonthAgoTimestamp(),
            "end":new Date().getTime()/1000
          }
        }
      }).then((res)=>{
        this.todoList.forEach(item => {
          item.num = res[item.type]
        });
      })
    },
    getSevenDaysAgoTimestamp() {
      var currentDate = new Date();
      currentDate.setDate(currentDate.getDate() - 7);
      currentDate.setHours(0, 0, 0, 0);
      return Math.floor(currentDate.getTime() / 1000);
    },
    getOneMonthAgoTimestamp() {
      var currentDate = new Date();
      currentDate.setUTCMonth(currentDate.getUTCMonth() - 1);
      currentDate.setUTCDate(1);
      currentDate.setUTCHours(0, 0, 0, 0);
      return Math.floor(currentDate.getTime() / 1000);
    },
    getSixWeeksAgoMondayTimestamp() {
      var currentDate = new Date();
      currentDate.setDate(currentDate.getDate() - (6 * 7 + (currentDate.getDay() + 6) % 7));
      currentDate.setHours(0, 0, 0, 0);
      return Math.floor(currentDate.getTime() / 1000);
    },
    changeAccToken(token,url){
      this.access_token = token
      this.baseUrl = url
      toast.success("修改成功");
      this.setVisible = !this.setVisible
    },
    // 获取昨天最后一秒
    getYesterdayLastSecondTimestamp() {
      var currentDate = new Date();
      currentDate.setDate(currentDate.getDate() - 1);
      currentDate.setHours(23, 59, 59, 0);
      return Math.floor(currentDate.getTime() / 1000);
    }

  
  },
  persist: {
    enabled: true,
    strategies: [{
      // 自定义存储的 key，默认是 store.$id
      // 可以指定任何 extends Storage 的实例，默认是 sessionStorage
      storage: dbStorage,
      paths: ['access_token','baseUrl']
      // state 中的字段名，按组打包储存
    }]
  }
})
