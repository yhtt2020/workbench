import {defineStore} from "pinia";
import dbStorage from "./dbStorage";
import {nanoid} from 'nanoid'
import {timerStore} from "./timer";
import {marketStore} from "./market";
import {noteStore} from "../apps/note/store";
import{homeStore} from "./home"
// @ts-ignore

export const cardStore = defineStore(
  "cardStore",
  {
    // @ts-ignore
    state: () => {
      return {
        moved: false,
        desks: [{
          name: '基础桌面',
          nanoid: nanoid(4),
          cards: []
        }
        ],
        settings: {
          cardZoom: 100,
          marginTop: 0,
          cardMargin: 5//卡片间隙
        },
        aloneSettings: {
          cardZoom: 100,
          marginTop: 0,
          cardMargin: 5
        },
        countdownDay: [{
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
        clockEvent: [],
        customComponents: [],
        clockTag: 'within30min',
        chooseType: '1',
        filterClockEvent: [],
        aidaData: null,
        routeParams: {},
        clockFlag: false,
        deskSize: {},
        lastHeight: 0,

      };
    },
    getters: {},
    actions: {
      switchToDesk(index) {
        let desk = this.desks[index]
        homeStore().currentDeskIndex = {
          name: desk.nanoid,
          title: desk.name
        }
      },
      getCurrentIndex() {
        let deskIndex = this.desks.findIndex(item => {
          return item.nanoid === homeStore().currentDeskIndex.name
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
          id: nanoid(4),
          nanoid: nanoid(4),
          cards: cards
        }
        this.desks.push(desk)
        return desk
      },
      addShareDesk(data, layoutSize, deskList) {
        setTimeout(() => {
          // let cardZoom;
          // if(this.deskSize.cardsHeight){
          //   cardZoom = (data.settings.cardZoom * this.deskSize.cardsHeight/data.cardsHeight).toFixed()
          // }else{
          //   cardZoom = (data.settings.cardZoom * this.lastHeight/data.cardsHeight).toFixed()
          // }
          // let cardZoom = (data.settings.cardZoom * this.deskSize.cardsHeight/data.cardsHeight).toFixed()
          // data.settings.cardZoom =
          console.log(data, '商品id')
          marketStore().incCount(data.dataNanoid)
          data.settings.preparing = true//设置为未初始化，等到第一次进去的时候再初始化
          data.settings.layoutSize = layoutSize
          let desk = {
            name: data.title,
            nanoid: nanoid(4),
            id: nanoid(4),
            cards: data.cards,
            marketId: data.dataNanoid,
            settings: {...data.settings, enableZoom: true},
            // showSettings: true
          }
          this.aloneSettings = data.settings
          console.log(desk, '需要添加的desk')
          console.log(deskList, '父列表')
          deskList.unshift(desk)
          //this.switchToDesk(this.deskList.length - 1)
          return desk
        }, 350);
      },
      setDeskSize(item) {
        this.deskSize = item
      },
      getCurrentDesk() {
        let desk = this.desks.find(item => {
          return item.id === homeStore().currentDeskId
        })
        return desk
      },
      setRouteParams(value) {
        this.routeParams = value
      },
      // removeNavigationList(index) {
      //   this.navigationList.splice(index, 1)
      // },
      // sortNavigationList(evt) {
      //   let temp = this.navigationList[evt.oldIndex]
      //   this.navigationList.splice(evt.oldIndex, 1)
      //   this.navigationList.splice(evt.newIndex, 0, temp)
      // },
      // setNavigationList(item) {
      //   this.navigationList.push(item)
      // },
      setAidaData(value) {
        this.aidaData = value;
      },
      setAppDate(value) {
        timerStore().appDate = value;
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
            value.dateValue.year > timerStore().appDate.year ||
            (value.dateValue.year === timerStore().appDate.year &&
              value.dateValue.month > timerStore().appDate.month) || (value.dateValue.year === timerStore().appDate.year &&
              value.dateValue.day >= timerStore().appDate.day && value.dateValue.month === timerStore().appDate.month)
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

        // if(this.clockEvent[this.clockEvent.length-1].clockType==='每天'&&this.clockEvent[this.clockEvent.length-1].dateValue.dateValue.hours===timerStore().appDate.hours&&
        //   this.clockEvent[this.clockEvent.length-1].dateValue.dateValue.minutes===timerStore().appDate.minutes){
        //   this.everySortClock()
        // }else{
        this.sortClock();
        //}
        this.clockFlag = !this.clockFlag
      },
      sortClock() {
        for (let i = 0; i < this.clockEvent.length; i++) {
          if (this.clockEvent[i].dateValue.hours !== timerStore().appDate.hours && this.clockEvent[i].flag === true ||
            this.clockEvent[i].dateValue.minutes !== timerStore().appDate.minutes && this.clockEvent[i].flag === true)
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
            (value.dateValue.hours > timerStore().appDate.hours) ||
            (value.dateValue.hours === timerStore().appDate.hours &&
              value.dateValue.minutes >= timerStore().appDate.minutes)
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
      filterClock(tag, value) {
        // console.log(tag);
        this.filterClockEvent = this.clockEvent
        // this.temp=value
        // console.log(value,'this.temp');
        // if(tag!==null || undefined){
        // console.log(tag);

        this.clockTag = tag
        this.chooseType = value

        // }
        // console.log(this.clockTag);
        if (this.clockTag == 'within30min') {
          this.filterClockEvent = this.clockEvent.filter((value) => {
            let totalTime = parseInt(timerStore().appDate.hours) * 60 + parseInt(timerStore().appDate.minutes)
            let targetTime = parseInt(value.dateValue.hours) * 60 + parseInt(value.dateValue.minutes)
            let timeDiff = targetTime - totalTime
            return timeDiff <= 30 && timeDiff > 0

          })
          // console.log(this.filterClockEvent);

        } else if (this.clockTag == 'within1hour') {
          this.filterClockEvent = this.clockEvent.filter((value) => {
            let totalTime = parseInt(timerStore().appDate.hours) * 60 + parseInt(timerStore().appDate.minutes)
            let targetTime = parseInt(value.dateValue.hours) * 60 + parseInt(value.dateValue.minutes)
            let timeDiff = targetTime - totalTime
            return timeDiff <= 60 && timeDiff > 0
          })
        } else if (this.clockTag == 'always') {
          this.filterClockEvent = this.clockEvent
        }
        // console.log(this.clockTag,'this.clockTag');

        // console.log(this.filterClockEvent);


      },
      async addCard(card, desk, flag) {
        //if (this.customComponents.includes(value)) return;
        // let desk = this.desks.find(item => {
        //   return item.nanoid === this.currentDeskIndex.name
        // })
        // 便签卡片需要进行db存储
        if (card.name == 'notes' && !flag) {
          let obj: any = {
            ...card,
            customData: {
              ...card.customData,
              title: '桌面便签',
              background: "#57BF60",
              cardSize: 'card',
              colors: "#ffffff",
              height: 2,
              width: 1,
              text: '',
              dragCardSize: 'card',
              content: '',
            },
            _id: 'note:' + card.id,
            updateTime: card.id,
            createTime: card.id,
            content:'',
            name: 'notes',
            notes: 'notes',
            isDelete: false,
            deskName: desk.name,
            deskId: desk.id,
          }
          desk.cards.push(obj)

          await tsbApi.db.put(obj)
        } else {
          desk.cards.push(card)
        }
      },
      /**
       * 更新组件的customData，多个值的变更请一次性提交，newData为对象
       * @param customIndex 组件的customIndex索引
       * @param newData 变更的数据，可一次性变更多个来提升性能
       * @param desk 当前的桌面
       */
      updateCustomData(customIndex, newData, desk) {
        if (!desk) {
          throw '未提交desk参数，此参数必须提供'
        }
        let currentDesk = desk// || this.getCurrentDesk()
        const findCard = currentDesk.cards.find(el => {
          return customIndex === el.id
        })
        if (!findCard) {
          throw '未找到需要设置的组件'
        }
        findCard.customData = {...findCard.customData, ...newData}
      },
      async removeCard(customIndex, desk, flag) {
        let currentDesk = this.getCurrentDesk()
        desk = desk || currentDesk
        desk.cards.splice(desk.cards.findIndex(item => {
          return String(item.id) === String(customIndex)
        }), 1)
        console.log('删除 卡片:>> ', desk.cards);

        // this.customComponents.splice(customIndex,1);

      },
      setDataEmpty() {
      },
      insetSteamSize(value, newData) {
        let currentDesk = this.getCurrentDesk()
        const findCustom = currentDesk.cards.find(el => {
          return value === el.id
        })
        currentDesk.cards[currentDesk.cards.indexOf(findCustom)].data = {...currentDesk.cards[currentDesk.cards.indexOf(findCustom)].data, ...newData}
      }
    },
    persist: {
      enabled: true,
      strategies: [{
        // 自定义存储的 key，默认是 store.$id
        // 可以指定任何 extends Storage 的实例，默认是 sessionStorage
        paths: ['countdownDay', 'clockEvent', 'customComponents', 'navigationList', 'settings', 'desks', 'moved', 'deskSize', 'lastHeight', 'clockTag', 'chooseType'],
        storage: dbStorage,
        // state 中的字段名，按组打包储存
      }]
    }
  },

  {}
);
