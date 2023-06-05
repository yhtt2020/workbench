import {defineStore} from "pinia";
import dbStorage from "./dbStorage";
import {compareTime, randomData, sendRequest} from '../js/axios/api'
import {nanoid} from "nanoid";

const {steamUser, steamSession, path, https, steamFs} = $models
let client = new steamUser({
  enablePicsCache: true
});

window.client = client
// @ts-ignore
export const steamUserStore = defineStore("steamUser", {
  state: () => ({
    desks: [{
      name: '主桌面',
      nanoid: nanoid(4),
      cards: [],
      settings: {}
    }
    ],

    steamLoginData: {
      accessToken: '',
      refreshToken: '',
      webCookies: ''
    },
    userData: {},
    gameList: [],
    myGameList: [],
    myFriends:[],

    //好友列表
    friendsList: [],
  }),
  actions: {
    bindClientEvents(){
      console.log('绑定steamClient事件')
      client.on('friendsList',()=>{
        console.log('获取到我的好友')
        console.log(client.myFriends)
        console.log(this.myFriends,'我的好友列表=')
        client.getPersonas(Object.keys(client.myFriends),(err,users)=>{
          console.log('返回了我的好友',err,users)
          if(err){
            console.error(err)
            return
          }
          this.myFriends=users
        })
      })
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
        client.gamesPlayed([1172470]);
        client.on('appOwnershipCached', () => {
          console.log('游戏库存改变');
          client.getUserOwnedApps(client.steamID.getSteamID64(), {
            includeFreeSub: true,
            includePlayedFreeGames: true
          }, (err, data) => {
            if (err) console.log(err)
            this.setGameList(data.apps)
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
    },
    addGameDetail(value) {
      value.forEach((e) => {
        const obj = this.gameList.find(i => i.appid == e.appinfo.appid)
        if (obj) {
          e.time = obj
        }
      })
      this.gameList = value
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
      paths: ['steamLoginData', 'gameList', 'desks', 'friendList', 'myGameList'],
      storage: dbStorage,
      // state 中的字段名，按组打包储存
    }]
  }
});
