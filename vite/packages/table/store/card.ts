import {defineStore} from "pinia";
import dbStorage from "./dbStorage";
import {nanoid} from 'nanoid'

// @ts-ignore
export const cardStore = defineStore(
  "cardStore",
  {
    state: () => {
      return {
        moved: false,
        currentDeskIndex: {},
        desks: [{
          name: '日常桌面',
          nanoid: nanoid(4),
          cards: []
        },
          {
            name: '游戏桌面',
            nanoid: nanoid(4),
            cards: []
          }],
        settings: {
          cardZoom: 100,
          marginTop: 0,
          cardMargin: 5//卡片间隙
        },
        countdownDay: [{
          "eventValue": "端午节",
          "dateValue": {
            "year": 2023,
            "month": 6,
            "day": 22,
            "hours": 0,
            "minutes": 0,
            "seconds": 0,
            "week": "星期四"
          },
          "type": 'noOver'
        }, {
          "eventValue": "中秋节",
          "dateValue": {
            "year": 2023,
            "month": 9,
            "day": 29,
            "hours": 0,
            "minutes": 0,
            "seconds": 0,
            "week": "星期五"
          },
          "type": 'noOver'
        }, {
          "eventValue": "国庆节",
          "dateValue": {
            "year": 2023,
            "month": 10,
            "day": 1,
            "hours": 0,
            "minutes": 0,
            "seconds": 0,
            "week": "星期日"
          },
          "type": 'noOver'
        }],
        appDate: {},
        clockEvent: [],
        customComponents: [],
        aidaData: null,
        navigationList: [
          {
            "icon": "https://res.wx.qq.com/a/wx_fed/assets/res/OTE0YTAw.png",
            "name": "微信",
            "type": "coolApp",
            "summary": "在副屏上使用网页版微信聊天。（已适配小屏）",
            "needInstall": false,
            "data": {
              "theme": "#2e3238",
              "name": "weixin",
              "url": "https://wx.qq.com",
              "preload": "weixin",
              "background": true,
              "node": false,
              "security": true
            }
          },
          {
            "icon": "https://s1.hdslb.com/bfs/static/jinkela/popular/assets/icon_popular.png",
            "name": "网页数据监控小助手",
            "type": "coolApp",
            "summary": "一个用于检测网页数据的工具，可以实时监测一个网页数据动态，并组织成可视化的报表，目前支持B站视频数据追踪。",
            "needInstall": false,
            "data": {
              "fullScreen": false,
              "theme": "#030c13",
              "name": "watch",
              "type": "system",
              "route": "{\"name\":\"watch\"}"
            }
          },
          {
            "nanoid": "2GpOXkUi",
            "appid": "MiXNpK",
            "name": "应用市场",
            "author": null,
            "package": "com.thisky.appStore",
            "preload": "/pages/appStore/preload.js",
            "logo": "https://up.apps.vip/logo/favicon.svg",
            "summary": "应用市场，助您发现更大的世界。",
            "site": null,
            "type": "lightApp",
            "url": "https://a.apps.vip/d.appStore/index.html",
            "circle": null,
            "theme_color": "#3c78d8",
            "user_theme_color": "#3c78d8",
            "create_time": 1680576621883,
            "update_time": 1680576621883,
            "account_avatar": "",
            "order": 0,
            "use_count": 0,
            "last_execute_time": 1680576621883,
            "settings": {
              "bounds": {
                "width": 1180,
                "height": 864
              },
              "showInSideBar": true
            },
            "unread_count": 0,
            "file_assign": null,
            "auth": null,
            "is_new": false,
            "attribute": {
              "isOfficial": 1,
              "integration": 2
            },
            "window": {
              "defaultType": "frameWindow",
              "frameWindow": {
                "enable": true,
                "width": 1180,
                "height": 864,
                "controllers": {
                  "goBack": false,
                  "goForward": false,
                  "refresh": true,
                  "home": false
                }
              },
              "window": {},
              "attach": {}
            },
            "open_source": null,
            "csv_url": null,
            "os_summary": null,
            "is_debug": null,
            "is_fav": null,
            "capture": "",
            "isSystemApp": true,
            "userSettings": {
              "auth": {
                "base": {
                  "webSecure": false,
                  "node": false
                },
                "api": {},
                "ability": {}
              },
              "window": "{\"defaultType\":\"frameWindow\",\"frameWindow\":{\"enable\":true,\"width\":1180,\"height\":864,\"controllers\":{\"goBack\":false,\"goForward\":false,\"refresh\":true,\"home\":false}},\"window\":{},\"attach\":{}}",
              "optimize": {
                "autoRun": false,
                "keepRunning": false,
                "showInSideBar": false
              }
            },
            "origin": {
              "nanoid": "2GpOXkUi",
              "appid": "MiXNpK",
              "name": "应用市场",
              "author": null,
              "package": "com.thisky.appStore",
              "preload": "/pages/appStore/preload.js",
              "logo": "https://up.apps.vip/logo/favicon.svg",
              "summary": "应用市场，助您发现更大的世界。",
              "site": null,
              "type": "web",
              "url": "https://a.apps.vip/d.appStore/index.html",
              "circle": null,
              "theme_color": "#3c78d8",
              "user_theme_color": "",
              "create_time": 1680576621883,
              "update_time": 1680576621883,
              "account_avatar": "",
              "order": 0,
              "use_count": 0,
              "last_execute_time": 1680576621883,
              "settings": {
                "bounds": {
                  "width": 1180,
                  "height": 864
                },
                "showInSideBar": true
              },
              "unread_count": 0,
              "file_assign": null,
              "auth": null,
              "is_new": false,
              "attribute": {
                "isOfficial": 1,
                "integration": 2
              },
              "window": {
                "defaultType": "frameWindow",
                "frameWindow": {
                  "enable": true,
                  "width": 1180,
                  "height": 864,
                  "controllers": {
                    "goBack": false,
                    "goForward": false,
                    "refresh": true,
                    "home": false
                  }
                },
                "window": {},
                "attach": {}
              },
              "open_source": null,
              "csv_url": null,
              "os_summary": null,
              "is_debug": null,
              "is_fav": null,
              "capture": "",
              "isSystemApp": true,
              "userSettings": {
                "auth": {
                  "base": {
                    "webSecure": false,
                    "node": false
                  },
                  "api": {},
                  "ability": {}
                },
                "window": "{\"defaultType\":\"frameWindow\",\"frameWindow\":{\"enable\":true,\"width\":1180,\"height\":864,\"controllers\":{\"goBack\":false,\"goForward\":false,\"refresh\":true,\"home\":false}},\"window\":{},\"attach\":{}}",
                "optimize": {
                  "autoRun": false,
                  "keepRunning": false,
                  "showInSideBar": false
                }
              }
            },
            "icon": "https://up.apps.vip/logo/favicon.svg"
          },
          {
            "type": "systemApp",
            "icon": "lock",
            "name": "锁定屏幕",
            "event": "lock"
          },
          {
            "type": "systemApp",
            "icon": "setting",
            "name": "基础设置",
            "event": "setting"
          },
          {
            "type": "systemApp",
            "icon": "fullscreen",
            "name": "全屏显示",
            "event": "fullscreen"
          },
          {
            "type": "systemApp",
            "icon": "laptop",
            "name": "设备设置",
            "event": "status"
          },
          {
            "type": "systemApp",
            "icon": "tuichu",
            "name": "电源",
            "event": "power"
          }
        ],
        routeParams: {},
        clockFlag: false,
      };
    },

    actions: {
      switchToDesk(index) {
        let desk = this.desks[index]
        this.currentDeskIndex = {
          name: desk.nanoid,
          title: desk.name
        }
      },
      getCurrentIndex() {
        let deskIndex = this.desks.findIndex(item => {
          return item.nanoid === this.currentDeskIndex.name
        })
        return deskIndex
      },
      removeDesk(index) {
        if (this.desks.length === 1) {
          return false//至少保留一个桌面
        }
        this.desks.splice(index, 1)
        if (index < this.desks.length) {
          this.switchToDesk(index)
        } else {
          if (index - 1 < 0) {
            this.switchToDesk(0)
          } else {
            this.switchToDesk(index - 1)
          }

        }

      },
      addDesk(name, cards = []) {
        if (name.trim() === '') {
          return false
        }
        let desk = {
          name: name,
          nanoid: nanoid(4),
          cards: cards
        }
        this.desks.push(desk)
        return desk
      },
      getCurrentDesk() {
        let desk = this.desks.find(item => {
          return item.nanoid === this.currentDeskIndex.name
        })
        return desk
      },
      setRouteParams(value) {
        this.routeParams = value
      },
      removeNavigationList(index) {
        this.navigationList.splice(index, 1)
      },
      sortNavigationList(evt) {
        let temp = this.navigationList[evt.oldIndex]
        this.navigationList.splice(evt.oldIndex, 1)
        this.navigationList.splice(evt.newIndex, 0, temp)
      },
      setNavigationList(item) {
        this.navigationList.push(item)
      },
      setAidaData(value) {
        this.aidaData = value;
      },
      setAppDate(value) {
        this.appDate = value;
      },

      addCountdownDay(value) {
        this.countdownDay.push(value);
        this.sortCountdown()
        //   this.saveCountdownDay();
      },
      sortCountdown() {
        for (let i = 0; i < this.countdownDay.length; i++) {
          this.countdownDay[i].type = null
        }
        this.countdownDay.sort((v1, v2) => {
          let value1 = v1.dateValue;
          let value2 = v2.dateValue;
          if (value1.year === value2.year) {
            if (value1.month === value2.month) return value1.day - value2.day;
            return value1.month - value2.month;
          }
          return value1.year - value2.year;
        });
        const a = this.countdownDay.filter((value) => {
          return (
            value.dateValue.year > this.appDate.year ||
            (value.dateValue.year === this.appDate.year &&
              value.dateValue.month > this.appDate.month) || (value.dateValue.year === this.appDate.year &&
              value.dateValue.day >= this.appDate.day && value.dateValue.month === this.appDate.month)
          );
        });
        for (let i = 0; i < a.length; i++) {
          a[i].type = 'noOver'
        }
        if (a.length !== 0)
          this.countdownDay = [...a, ...this.countdownDay.slice(0, -a.length)];
      },
      removeCountdownDay(index) {
        this.countdownDay.splice(index, 1);
      },
      addClock(value) {
        this.clockEvent.push(value);
        // if(this.clockEvent[this.clockEvent.length-1].clockType==='每天'&&this.clockEvent[this.clockEvent.length-1].dateValue.dateValue.hours===this.appDate.hours&&
        //   this.clockEvent[this.clockEvent.length-1].dateValue.dateValue.minutes===this.appDate.minutes){
        //   this.everySortClock()
        // }else{
        this.sortClock();
        //}
        this.clockFlag = !this.clockFlag
      },
      sortClock() {
        for (let i = 0; i < this.clockEvent.length; i++) {
          if (this.clockEvent[i].dateValue.hours !== this.appDate.hours && this.clockEvent[i].flag === true ||
            this.clockEvent[i].dateValue.minutes !== this.appDate.minutes && this.clockEvent[i].flag === true)
            this.clockEvent[i].flag = undefined;
        }
        this.clockEvent.sort((v1, v2) => {
          let value1 = v1.dateValue;
          let value2 = v2.dateValue;
          if (value1.hours === value2.hours) {
            return value1.minutes - value2.minutes;
          }
          return value1.hours - value2.hours;
        });
        const a = this.clockEvent.filter((value) => {
          return (
            (value.dateValue.hours > this.appDate.hours) ||
            (value.dateValue.hours === this.appDate.hours &&
              value.dateValue.minutes >= this.appDate.minutes)
          );
        });
        const b = this.clockEvent.filter((value) => {
          return (value.flag === true);
        });
        if (a.length !== 0)
          this.clockEvent = [...a, ...this.clockEvent.slice(0, -a.length)];
        for (let i = 0; i < b.length; i++) {
          let e = this.clockEvent.shift()
          this.clockEvent.push(e)
        }

      },
      removeClock(index, n) {
        if (this.clockEvent[0].clockType !== '每天' || n === 1) {
          this.clockEvent.splice(index, 1);
        } else {
          const a = this.clockEvent.shift()
          a.flag = true;
          this.sortClock()
          this.clockEvent.push(a)

        }
        this.clockFlag = !this.clockFlag
      },
      addCustomComponents(value) {
        //if (this.customComponents.includes(value)) return;
        let desk = this.desks.find(item => {
          return item.nanoid === this.currentDeskIndex.name
        })
        desk.cards.push(value)
      },
      updateCustomComponents(value, newData) {
        let currentDesk = this.getCurrentDesk()
        const findCustom = currentDesk.cards.find(el => {
          return value === el.id
        })
        currentDesk.cards[currentDesk.cards.indexOf(findCustom)].data = {Code: {id: value, value: newData}}
      },
      removeCustomComponents(customIndex) {
        let currentDesk = this.getCurrentDesk()
        currentDesk.cards.splice(currentDesk.cards.findIndex(item => {
          return item.id === customIndex
        }), 1)
        // this.customComponents.splice(customIndex,1);

      },
      setDataEmpty() {

      }
    },
    persist: {
      enabled: true,
      strategies: [{
        // 自定义存储的 key，默认是 store.$id
        // 可以指定任何 extends Storage 的实例，默认是 sessionStorage
        paths: ['countdownDay', 'clockEvent', 'customComponents', 'navigationList', 'settings','desks','currentDeskIndex','moved'],
        storage: dbStorage,
        // state 中的字段名，按组打包储存
      }]
    }
  },

  {}
);
