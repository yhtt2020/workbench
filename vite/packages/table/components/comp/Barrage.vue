<template>

</template>

<script>
import { message } from 'ant-design-vue'
import { appStore } from '../../store'
import {mapState} from 'pinia'

export default {
  name: 'Barrage',
  computed:{
    ...mapState(appStore,['settings'])
  },
  async mounted () {
    let that = this
    const settings=this.settings
    const manager = Danmuku.create({
      container: document.body,
      interval: 1,
      times: [20, 25],
      direction:settings.barrage.direction,
      limit:settings.barrage.limit,
      height:settings.barrage.height,
      hooks: {
        send (manager, data) {
        },

        barrageCreate (barrage, node) {
          if (!barrage.isSpecial) {
            // 设置弹幕内容和样式
            node.classList.add('barrage-style')
            if (barrage.data.self) {
              node.style.background = 'black'
              node.style.fontWeight = 'bold'
            }
          }
        },
        barrageAppend (barrage, node) {
          //node.textContent = barrage.data.content
          node.textContent = barrage.data.self ? '我：' + barrage.data.content : barrage.data.content
          let data = barrage.data
          if (barrage.data.avatar) {
            let avatarEl = document.createElement('img')
            avatarEl.classList.add('barrage-avatar')
            avatarEl.src = data.avatar
            node.appendChild(avatarEl)
          }
          node.classList.add('barrage-style')
          node.onmouseenter = e => barrage.pause()
          node.onmouseleave = e => {if ($manager.runing) barrage.resume()}
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
      height:100
    })
    tsbApi.barrage.init()
    tsbApi.barrage.setOnUrlChanged((url)=>{
      this.changeUrl(url)
    }) //挂载url变化事件
    this.pageUrl = (await tsbApi.tabs.current()).sourceUrl
    this.getList()
    window.$manager = manager
    window.$manager.reload=this.getList
    this.manager=manager
    window.addEventListener('resize',()=>{
      console.log('rezied')
      manager.resize()
    })
    manager.start()
    manager.show()
  },
  methods:{
    async changeUrl(url) {
      this.pageUrl = url
      await this.getList()
    },
    async getList() {
      this.CONST = tsbApi.barrage.CONST
      try {
        let rs = await tsbApi.barrage.getList(this.CONST.CHANNEL.PUBLIC, this.pageUrl)
        this.barrages = rs.data
        if (rs.status) {
          $manager.clear()
          $manager.send(this.barrages)
          $manager.start()
        } else {
          message.error('获取弹幕接口返回错误，可能是服务器正在维护，请稍后再试。')
        }
      } catch (e) {
        console.error(e)
        message.error('获取弹幕意外错误。')
      }
    },
  }
}
</script>

<style lang="scss">

.barrage-style:hover{
  border:2px solid rgba(255, 255, 255, 0.47);
  background: #000;
}
.barrage-style:hover .barrage-btn-wrapper{
  display: block;
}
.barrage-opt-button{
  border-radius: 6px;
  background:rgba(0, 0, 0, 0.5) ;
  color: white;
  padding: 5px 8px;
  line-height: 18px;
  font-size: 12px;
  width: 50px;
  display: inline-block;
  cursor: pointer;
}
.barrage-opt-button:hover{
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
