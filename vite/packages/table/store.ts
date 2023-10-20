import {defineStore} from "pinia";
import dbStorage from "./store/dbStorage";
import {sUrl} from './consts'

const userCardUrl = sUrl('/app/com/userCard')
import axios from 'axios'
import {getConfig} from "./js/axios/serverApi";
import cache from '../table/components/card/hooks/cache'
import {post} from "./js/axios/request";

// @ts-ignore
export const appStore = defineStore('appStore', {
  state: () => ({
    currentRoute:undefined,//当前路由


    //用户信息卡片
    userCardVisible: false,
    userCardUid: 0,
    userCardUserInfo: {
      certification: []
    },
    userInfo: false,
    lvInfo: {},
    myData: {
      myCircle: [],
      joinedCircle: []
    },
    style: "", // 指定样式
    styles: false,  // 浅色切换功能
    stylesIndex:0, // 主题模式下标
    saving: true,//性能模式

    simple: false,//极简模式
    agreeTest: false,
    infoVisible:false, // 修改我的信息显示时机
    secondaryVisible:false, // 我的信息页面二次判断是否为默认头像
    init: false, //是否已经初始化

    fullScreen: false, //是否是全屏模式
    searchFullScreen:false, // 聚合搜索全屏

    showWindowController:true,//窗口全屏，这个和上面的全屏不是同一个，区别是这个只影响窗体在系统层面上的最大化。

    settings: {
      transparent: false,//透明背景
      duck:false,//音量控制的时候，鸭子叫
      down: {
        enable: false,
        count: 100,
        type: 'rain'
      },
      houserun: false,//rgb跑马灯
      zoomFactor: 100,//缩放比
      openUrlBrowser: 'builtin',//默认打开浏览器
      enableChat: true,//主界面显示聊天，默认开启聊天
      preventLock: false,//阻止锁屏
      noticeEnable:true, // 社群通知开关
      enablePlay:true, // 开启消息提示语开关
      messagePlay:false, // 消息接收提示语播放
      noticePlay:false, // 通知接收提示语播放

      enableBarrage: false, //启用弹幕
      barrage: {
        height: 100, //单个轨道的高度
        limit: 5, //单个屏幕允许的数量
        repeat: 2, //重复次数
        direction: "right",
        browserLink: true, //和浏览器联动
      }, //弹幕设置
      ui: {}, //ui设置
      showButtonTitle: false,
      darkMod: true, //深色模式
      attachScreen: null, //id,bounds
      isAllSelected:false,
    },

    routeUpdateTime: Date.now(),//用于更新滚动条
    status: {
      music: {//存当前播放的音乐
        notInit: true,
        cover: '',
        title: ''
      },
      show:false, // 工作台页面顶部消息图标显示
    },
    backgroundSettings: {
      backGroundImgBlur: 0,
      backGroundImgLight: 0.3,
    },
    backgroundImage: {
      path: ''
    },
    aggList:{
      type:'work'
    },

  }),
  getters: {},

  actions: {

    async showUserCard(uid, userInfo = null) {
      this.userCardUid = Number(uid)
      if (userInfo) {
        //如果存在用户数据，则使用此数据显示卡片
        this.userCardUserInfo = userInfo
        this.userCardVisible = true
      }
      let response = await this.getUserCard(uid)
      if (response.code === 200) {
        const data = response.data
        this.userCardUserInfo = {
          uid: uid,
          nickname: data.user.nickname,
          avatar: data.user.avatar_128,
          signature: data.user.signature,
          certification: data.user.all_certification_entity_pc || []
        }
        this.userCardVisible = true
      }
    },

    /**
     * 获取用户小卡片
     * @param uid
     */
    async getUserCard(uid) {
      return post(userCardUrl,{uid: uid})
    },

    setBackgroundImage(value) {
      this.backgroundImage = value
    },
    setAgreeTest() {
      this.agreeTest = false
    },
    setInfoVisible(value){
      this.infoVisible = value
    },
    setSecondaryVisible(value){
      this.secondaryVisible = value
    },
    reset() {
      this.fullScreen = false
    },


    /**
     * 结束新手引导
     */
    finishWizard() {
      this.init = true;
      this.agreeTest = true

    },

    setMusic(status) {
      this.status.music = status;
      this.status.music.cover = status.cover.replace("34y34", "120y120"); //修正封面
    },

    getUserInfo() {
      ipc.send('getDetailUserInfo')
    },

    /**
     * 设置当前用户
     * @param userInfo
     */
    setUser(userInfo) {
      userInfo.onlineGradeExtra.cumulativeMinutes = Number(userInfo.onlineGradeExtra.minutes) - Number(userInfo.onlineGradeExtra.cumulativeHours) * 60
      userInfo.onlineGradeExtra.cumulativeMinute = userInfo.onlineGradeExtra.minutes
      userInfo.onlineGradeIcons = {}
      userInfo.onlineGradeIcons.crown = []
      userInfo.onlineGradeIcons.sun = []
      userInfo.onlineGradeIcons.moon = []
      userInfo.onlineGradeIcons.star = []

      userInfo.uid = Number(userInfo.uid)

      function handleGrade(name) {
        for (let i = 0; i < userInfo.onlineGrade[name]; i++) {
          userInfo.onlineGradeIcons[name].push({
            icon: 'file://' + window.globalArgs['app-dir_name'] + `/../../icons/grade/${name}.svg`
          })
        }
      }

      Object.keys(userInfo.onlineGrade).forEach(v => handleGrade(v))
      this.userInfo = userInfo
    },

    // 修改当前背景色模式
    updateMode(val:boolean){
      this.styles = val
      const getIndex = cache.get('index')
      this.stylesIndex = getIndex
    },

    // 修改当前极简模式
    updateSimple(val:boolean){
      this.simple = val
    },
    getAggList(){ // 将聚合搜索拖拽列表排序后的数组进行存储
      this.aggList.list = cache.get('aggSortList')
    },
    setSearchFullScreen(value:boolean){  // 设置聚合搜索全屏
      this.searchFullScreen = value
    },
    setSearchIndex(index:number){  // 设置小卡片底部选中状态
      this.aggList.select_status = index
    },
    setSearchUrlOpenType(value:object){  // 设置搜索路径打开方式类型
      this.aggList.type = value
    },

    // 修改当前社群消息通知开关
    setNoticeOnOff(val:boolean){
      this.settings.noticeEnable = val
    },

    showNoticeEntry(){  // 显示消息通知入口
      this.status.show = true
    },
    hideNoticeEntry(){  // 隐藏消息通知入口
      this.status.show = false
    },

    setMessagePrompt(val:boolean){  // 设置消息通知提示语开关
      this.settings.enablePlay = val
    },
    setMessagePlay(){ // 设置消息提示语
      this.settings.messagePlay = true
    },
    setNoticePlay(){  // 设置通知提示语
      this.settings.noticePlay = true
    },

    setAllSelectStatus(val:any){
      // console.log('排查undefined问题',val);
      this.settings.isAllSelected = val
    }

  },
  persist: {
    enabled: true,
    strategies: [{
      // 自定义存储的 key，默认是 store.$id
      // 可以指定任何 extends Storage 的实例，默认是 sessionStorage
      paths: ['currentRoute','status', 'settings', 'init', 'agreeTest', 'backgroundSettings', 'infoVisible','backgroundImage', 'saving', 'simple', 'styles','stylesIndex', 'style','windowFullScreen','aggList'],
      storage: dbStorage,
      // state 中的字段名，按组打包储存
    }]
  }
}, {})
