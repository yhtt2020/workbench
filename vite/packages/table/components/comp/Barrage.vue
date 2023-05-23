<template></template>

<script>
import { message } from 'ant-design-vue'
import { appStore } from '../../store'
import { mapActions, mapState } from 'pinia'
import { teamStore } from '../../store/team'

export default {
  name: 'Barrage',
  data() {
    return {
      sendBarragesCount: {},//用于屏蔽弹幕的数组，最终会存入localStorage ,nanoid:times
      filteredBarrages: [],//已经被屏蔽的
      timer: null,
      barragesTeam:{}
    }
  },
  computed: {
    ...mapState(appStore, ['settings']),
    ...mapState(teamStore, ['my','myTeamNo','myTeam']),
  },
  async mounted() {
    window.loadBarrage = this.loadAll
    if(!this.my.created){
      this.updateMy().then(()=>{
        this.getTeamBarrage().then()
      })
    }
    this.timer = setInterval(() => {
      this.changeUrl('table').then()
      this.getTeamBarrage().then()
    }, 60000)
    // this.$router.afterEach((to, from) => {
    //   this.changeUrl('table').then()
    // })
    //禁用路由切换的时候的barrage请求
    this.filteredBarrages = JSON.parse(localStorage.getItem('filteredBarrages')) || []
    this.sendBarragesCount = JSON.parse(localStorage.getItem('sendBarragesCount')) || {}
    let that = this
    const settings = this.settings
    const manager = Danmuku.create({
      container: document.body,
      interval: 1,
      times: [20, 25],
      direction: settings.barrage.direction,
      limit: settings.barrage.limit,
      height: settings.barrage.height,
      hooks: {
        send(manager, data) {
        },

        barrageCreate(barrage, node) {
          if (!barrage.isSpecial) {
            // 设置弹幕内容和样式
            node.classList.add('barrage-style')


            if (barrage.data.self) {
              node.style.background = 'black'
              node.style.fontWeight = 'bold'
            }
            if(barrage.data.type==='team'){
              node.style.background = '#177ddc'
              node.style.fontWeight = 'bold'
            }

          }
        },
        barrageAppend(barrage, node) {
          //node.textContent = barrage.data.content
          node.textContent = barrage.data.self ? '我：' + barrage.data.content : barrage.data.content
          if(barrage.data.type==='team'){
            node.textContent ='[小队]'+node.textContent
          }
          let data = barrage.data
          if (barrage.data.avatar) {
            let avatarEl = document.createElement('img')
            avatarEl.classList.add('barrage-avatar')
            avatarEl.src = data.avatar
            node.appendChild(avatarEl)
          }
          node.classList.add('barrage-style')
          node.onmouseenter = e => barrage.pause()
          node.onmouseleave = e => { if ($manager.runing) barrage.resume() }
          node.onclick = e => {
            that.visibleBarrageOperation = true
            that.currentBarrageData = barrage.data
            that.currentNode = node
          }
        }
      }
    })
    // manager.setOptions({
    //   container:document.getElementById('danmuWrapper'),
    //   limit:50
    // })
    manager.setOptions({
      height: 100
    })
    tsbApi.barrage.init()

    tsbApi.barrage.setOnUrlChanged((url) => {
      if (this.settings.barrage.browserLink) {
        this.changeUrl(url)
      }
    }) //挂载url变化事件

    this.pageUrl = 'table'// (await tsbApi.tabs.current()).sourceUrl
    if (this.settings.enableBarrage) {
      //如果开启弹幕则加载第一次
      this.getList().then()
    }

    window.$manager = manager
    window.$manager.reload = this.getList
    window.$manager.sendChat = this.sendChat
    this.manager = manager
    window.addEventListener('resize', () => {
      console.log('rezied')
      manager.resize()
    })
    manager.start()
    manager.show()
  },
  unmounted() {
    clearInterval(this.timer)
  },
  methods: {
    ...mapActions(teamStore,['updateMy']),
    async loadAll(url){
      this.changeUrl(url).then()
      this.getTeamBarrage().then()
    },
    async changeUrl(url) {
      this.pageUrl = url
      if (this.settings.enableBarrage) {
        //如果启用弹幕，才刷新
        await this.getList()
      }
    },

    async getTeamBarrage(){
      console.log('获取我的小队弹幕',this.myTeamNo)
      if (this.myTeamNo) {
        console.log(this.myTeamNo,'')
        tsbApi.barrage.getList(this.CONST.CHANNEL.TEAM, this.myTeamNo).then(rs => {
          if (rs.status) {
            console.log(rs,'取到的小队弹幕数据')
            rs.data.forEach(item => {
              item.create_time_text = tsbApi.util.friendlyDate(item.create_time)
              item.type='team'
            })
            this.barragesTeam = rs.data
            if (this.settings.enableBarrage) {
              console.log('发射弹幕：',this.barragesTeam)
              //如果是设置了启用弹幕
              $manager.send(this.filterBarrages(this.barragesTeam),undefined,true)//进行前置过滤
              $manager.start()
            }

          }
        })
      }
    },
    /**
     * 通过计数的方式进行弹幕的屏蔽
     */
    filterBarrages(list) {
      let sendList = list.filter(barrage => {
        if (this.filteredBarrages.indexOf(barrage.nanoid) > -1)//已经被屏蔽了
        {
          return false
        }
        if (!this.sendBarragesCount[barrage.nanoid]) {
          this.sendBarragesCount[barrage.nanoid] = 1
        } else {
          this.sendBarragesCount[barrage.nanoid]++
        }
        if (this.sendBarragesCount[barrage.nanoid] > this.settings.barrage.repeat) {
          this.filteredBarrages.push(barrage.nanoid)//加入屏蔽列表
          delete this.sendBarragesCount[barrage.nanoid] //移除屏蔽记录
          return false
        }
        return true//幸存下来的予以推送
      })
      localStorage.setItem('filteredBarrages', JSON.stringify(this.filteredBarrages))
      localStorage.setItem('sendBarragesCount', JSON.stringify(this.sendBarragesCount))
      //存入两个值
      return sendList

    },
    async sendChat(messages) {

      let barrages = []
      messages.forEach(mes => {
        if (mes.body === '') {
          return
        } else {
          if (!mes.avatar) {
            mes.avatar = 'https://up.apps.vip/logo/group.png?t=2'
          }
          barrages.push({
            avatar: mes.avatar,
            channel_type: -1,
            content: '【消息】' + mes.title + '：' + mes.body,
            nickname: mes.title,
          })
        }
      })
      $manager.send(barrages)
    },
    async getList() {
      this.CONST = tsbApi.barrage.CONST
      try {
        let rs = await tsbApi.barrage.getList(this.CONST.CHANNEL.PUBLIC, this.pageUrl)
        this.barrages = rs.data
        if (rs.status) {
          if (this.settings.enableBarrage) {
            //如果是设置了启用弹幕
            $manager.clear()
            $manager.send(this.filterBarrages(this.barrages))//进行前置过滤
            $manager.start()
          }

        } else {
          message.error({ content: '获取弹幕接口返回错误，可能是服务器正在维护，请稍后再试。', key: 'barrage' })
        }
      } catch (e) {
        console.error(e)
        message.error({ content: '获取弹幕意外错误。', key: 'barrage' })
      }
    },
  }
}
</script>

<style lang="scss">
.barrage-style:hover {
  border: 2px solid rgba(255, 255, 255, 0.47);
  background: #000;
}

.barrage-style:hover .barrage-btn-wrapper {
  display: block;
}

.barrage-opt-button {
  border-radius: 6px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 5px 8px;
  line-height: 18px;
  font-size: 12px;
  width: 50px;
  display: inline-block;
  cursor: pointer;
}

.barrage-opt-button:hover {
  opacity: 0.8;
}

.barrage-style {
  -webkit-app-region: no-drag;
  user-select: none;
  border-radius: 100px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 3px 15px;
  padding-right: 15px;
  vertical-align: middle;
  line-height: 28px;
  z-index: 999;
}

.barrage-avatar {
  object-fit: cover;
  -webkit-app-region: no-drag;
  border-radius: 100%;
  width: 30px;
  height: 30px;
  float: left;
  margin-left: -10px;
  margin-right: 6px;
  vertical-align: text-top;
}
</style>
