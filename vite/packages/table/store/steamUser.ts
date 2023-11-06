import {defineStore} from "pinia";
import dbStorage from "./dbStorage";
import {steamProtocol} from "../js/common/game";
import cache from "../components/card/hooks/cache";
const {steamUser, steamSession, path, https, steamFs} = $models
let client = new steamUser({
  enablePicsCache: true
});

window.client = client
// @ts-ignore
export const steamUserStore = defineStore("steamUser", {
  state: () => ({

    runningGame:{},
    recentGameList:[],
    hideGames:[],//隐藏的游戏
    settings:{
      showHideGame:false,
      proxy:{
        type:'none',//'web','http','socks5
        address:'127.0.0.1',
        port:7890,
        userName:'',
        password:''
      }
    },

    currentDeskId:'0',//当前的桌面id
    desks: [],//老数据格式
    desksOld:{},//老数据备份
    deskSettings: {
      cardZoom: 100,
      marginTop: 0,
      cardMargin: 5//卡片间隙
    },
    deskList:[],//最新的数据格式，用于替代desks
    steamLoginData: {
      accessToken: '',
      refreshToken: '',
      webCookies: ''
    },

    userData: {},
    steamGameList: [],//steam游戏列表
    originGameList: [],//steam原始列表
    localGameList: [],//本地游戏库列表
    myFriends: [],

    searchWords:{},//appid=>{video,text}

    //好友列表
    friendsList: [],
    // 显示游戏时长
    showTime:true,
  }),
  actions: {
    /**
     * 游玩游戏，并同时同步最近游玩的游戏
     * @param game
     */
    playGame(game){
      steamProtocol.run(game.appid)
      this.addRecent(game)
      this.runningGame=game
    },
    stopGame(game){
      this.runningGame={}
    },
    addRecent(game){
      let found=-1
       found=this.recentGameList.findIndex(g=>{
        return g.appid===game.appid
      })
      if(found>-1){
        this.recentGameList.splice(found,1)
      }
      this.recentGameList.unshift(game)
    },
    bindClientEvents() {
      client.on('friendsList', () => {
        client.getPersonas(Object.keys(client.myFriends), (err, users) => {
          if (err) {
            console.error(err)
            return
          }
          this.myFriends = users
        })
      })
    },
    /**
     * 返回steam-user的client，可以用于直接操作steam-user
     */
    getClient(){
      return window.client
    },
    onRefreshToken() {
      if (this.steamLoginData.refreshToken === '') {
        client.logOff();
        client.once('disconnected', () => {
        });
        return
      }
      client.logOn({"refreshToken": this.steamLoginData.refreshToken})
      client.on('loggedOn', (res, err) => {
        client.setPersona(steamUser.EPersonaState.Online);
        client.on('accountInfo', (name, country, authedMachine, flags, facebookID, facebookName) => {
          this.setUserData({name, country})
        });
        //client.gamesPlayed([1172470]); 模拟正在玩吃鸡
        client.on('appOwnershipCached', () => {
          client.getUserOwnedApps(client.steamID.getSteamID64(), {
            includeFreeSub: true,
            includePlayedFreeGames: true
          }, (err, data) => {
            if (err) console.log(err)
            this.originGameList = data.apps
          })
          client.getProductInfo(client.getOwnedApps({excludeFree: false}), [], (err, data) => {
            if (err) console.log(err)
            const list = []
            Object.keys(data).forEach(i => {
              if (data[i].appinfo.common) {
                if (data[i].appinfo.common.type === 'Game' && data[i].appinfo.common.oslist && data[i].appinfo.common.small_capsule || data[i].appinfo.common.type === 'game' && data[i].appinfo.common.oslist && data[i].appinfo.common.small_capsule) {
                  list.push(data[i])
                }
              }
            })
            this.addGameDetail(list)
          })

        });
        client.on('error', async function (err) {
          console.log(err)
        })
      })
    },
    setSteamLoginData(value) {
      this.steamLoginData = {...this.steamLoginData, ...value}
    },
    setUserData(value) {
      this.userData = {...value}
    },
    setSteamGameList(value) {
      this.steamGameList = value
      let list = value.filter(li => {
        return !!li.appinfo
      })
      this.steamGameList = list.map(game => {
        //此处映射需要用到的字段，以简化数据库存入，提升性能
        let formattedGame = {
          clientIcon:game.appinfo.common.clienticon,
          icon:game.appinfo.common.icon,
          logo:game.appinfo.common.logo,
          name: game.appinfo.common.name,
          chineseName:game.appinfo.common.name,
          metacritic_score: game.appinfo?.common.metacritic_score,
          appid: game.appinfo.appid,
          time:game.time
        }
        if(game.appinfo.common.name_localized){
          if(game.appinfo.common.name_localized.schinese){
            formattedGame.chineseName= game.appinfo.common.name_localized.schinese
          }
        }


        return formattedGame
      })
    },
    addGameDetail(value) {
      value.forEach((e) => {
        const obj = this.originGameList.find(i => i.appid == e.appinfo.appid)
        if (obj) {
          e.time = {
            playtime_2weeks: obj.playtime_2weeks,
            playtime_forever: obj.playtime_forever,
            playtime_linux_forever: obj.playtime_linux_forever,
            playtime_mac_forever: obj.playtime_mac_forever,
            playtime_windows_forever: obj.playtime_windows_forever,
            rtime_last_played: obj.rtime_last_played
          }
        }
      })
      this.setSteamGameList(value)
      this.steamGameList.sort((a, b) => {
        if (a.time === undefined && a.time === undefined) {
          return 0;
        } else if (a.time === undefined) {
          return 1;
        } else if (b.time === undefined) {
          return -1;
        } else if (a.time !== b.time) {
          return b.time.rtime_last_played - a.time.rtime_last_played;
        }
      });
      //   this.steamGameList.forEach((e,index) =>{
      //       const obj = value.find(i => i.appinfo.appid ==e.appid)
      //     if(obj){
      //       e.appinfo = obj.appinfo
      //       //console.log(e,obj)
      //      // e = {...e,...obj}
      //     }
      // })
    },
    updateGameTime(){ //修改我的游戏时长配置项
      this.showTime = cache.get('game_duration')
    },
  },
  persist: {
    enabled: true,
    strategies: [{
      // 自定义存储的 key，默认是 store.$id
      // 可以指定任何 extends Storage 的实例，默认是 sessionStorage
      paths: ['steamLoginData', 'steamGameList', 'friendList', 'localGameList','recentGameList','desks','searchWords','deskList','desksOld','deskSettings','settings','hideGames'],
      storage: dbStorage,
      // state 中的字段名，按组打包储存
    }]
  }
});
