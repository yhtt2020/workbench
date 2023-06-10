import {defineStore} from "pinia";
import dbStorage from "./dbStorage";
import {compareTime, randomData, sendRequest} from '../js/axios/api'
import {nanoid} from "nanoid";
import {steamProtocol} from "../js/common/game";

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
    desks: {},
    steamLoginData: {
      accessToken: '',
      refreshToken: '',
      webCookies: ''
    },
    userData: {},
    gameList: [],
    originGameList: [],
    myGameList: [],
    myFriends: [],

    //好友列表
    friendsList: [],
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
      console.log('绑定steamClient事件')
      client.on('friendsList', () => {
        console.log('获取到我的好友')
        console.log(client.myFriends)
        console.log(this.myFriends, '我的好友列表=')
        client.getPersonas(Object.keys(client.myFriends), (err, users) => {
          console.log('返回了我的好友', err, users)
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
      console.info('触发steamRefreshToken')
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
          console.log('游戏库存改变');
          client.getUserOwnedApps(client.steamID.getSteamID64(), {
            includeFreeSub: true,
            includePlayedFreeGames: true
          }, (err, data) => {
            if (err) console.log(err)
            console.log(data.apps, '获取到的游戏库存改变后的数据=')
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
    setGameList(value) {
      this.gameList = value
      let list = value.filter(li => {
        return !!li.appinfo
      })
      this.gameList = list.map(game => {
        //此处映射需要用到的字段，以简化数据库存入，提升性能
        console.log(game)
        let formattedGame = {
          name: game.appinfo.common.name,
          metacritic_score: game.appinfo?.common.metacritic_score,
          appid: game.appinfo.appid,
          time:game.time
        }
        return formattedGame
      })
    },
    addGameDetail(value) {
      console.log(value, 'addGameDetailreturn')
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
      this.setGameList(value)
      this.gameList.sort((a, b) => {
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
      //   this.gameList.forEach((e,index) =>{
      //       const obj = value.find(i => i.appinfo.appid ==e.appid)
      //     if(obj){
      //       e.appinfo = obj.appinfo
      //       //console.log(e,obj)
      //      // e = {...e,...obj}
      //     }
      // })
    }
  },
  persist: {
    enabled: true,
    strategies: [{
      // 自定义存储的 key，默认是 store.$id
      // 可以指定任何 extends Storage 的实例，默认是 sessionStorage
      paths: ['steamLoginData', 'gameList', 'friendList', 'myGameList','recentGameList','desks'],
      storage: dbStorage,
      // state 中的字段名，按组打包储存
    }]
  }
});
