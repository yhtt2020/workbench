<script lang="ts">
import { createVNode } from 'vue';
import {
  PlusOutlined,
  AppstoreAddOutlined,
  FolderOpenOutlined,
  ChromeOutlined,
  EyeOutlined,
  EllipsisOutlined,
  EyeInvisibleOutlined,
  GoogleOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons-vue '
import { Modal } from 'ant-design-vue';

export default {
  components: {
    PlusOutlined,
    AppstoreAddOutlined,
    FolderOpenOutlined,
    ChromeOutlined,
    GoogleOutlined,
    EyeOutlined,
    EllipsisOutlined,
    EyeInvisibleOutlined,
    DeleteOutlined,
    ExclamationCircleOutlined
  },
  data() {
    return {
      userDataPath: '',
      ipc: null,
    }
  },
  async mounted() {
    // this.ipc = tsbApi.ipc
    // this.ipc.on('show', () => {
    //   this.getList()
    // })
    // this.ipc.on('reload', () => {
    //   this.getList()
    // })
    // 这将创建一个弹幕 manager，用于管理弹幕
    const manager = Danmuku.create({
      container:document.getElementById('danmuWrapper'),
      hooks: {
        send (manager, data) {
          console.log(data)
        },

        barrageCreate (barrage, node) {
          if (!barrage.isSpecial) {
            console.log(barrage.data) // -> { content: 'one' }
            // 设置弹幕内容和样式
            node.textContent = barrage.data.content
            node.classList.add('barrage-style')
          }
        },
        barrageAppend (barrage, node) {
          node.textContent = barrage.data.content
          let data=barrage.data
          if(barrage.data.avatar){
            let avatarEl=document.createElement('img')
            avatarEl.classList.add('barrage-avatar')
            avatarEl.src=data.avatar
            node.appendChild(avatarEl)
          }
          node.classList.add('barrage-style')
          node.onmouseenter = e => barrage.pause()
          node.onmouseleave = e => barrage.resume()
          node.onclick = e => barrage.destroy()
        }
      }
    })
    console.log(manager)
    // manager.setOptions({
    //   container:document.getElementById('danmuWrapper'),
    //   limit:50
    // })
    setInterval(()=>{
      manager.send(this.makeBarrage())
    },500)

    setTimeout(()=>{
      manager.sendSpecial({
        content:this.makeBarrage()['content'],
        duration: 5,
        direction: 'right',
        position (barrage) {
          return {
            x: (manager.containerWidth - barrage.getWidth()) / 2,
            y: (manager.containerHeight- barrage.getHeight()) / 2
          }
        },
        hooks: {
          create (barrage) {
            barrage.node.style.background = 'red'
          }
        }
      })
    },3000)

    window.$manager=manager

    manager.start()
    manager.show()
  },
  methods: {
    makeBarrage(){
      const barrageContents=[
        '我哭了','好氪','肝疼',
        '全场最佳','太优雅了，太优雅了','没关系，我也不直','我也不懂',
        '火钳刘明','姐姐，他不直啊','BGM：独到','看看我姐姐',
        '火火火火火！！！！太棒了！！','我是我自己','33333','播放量起来了','发量惊人',
        '恭喜你发现啦宝藏','别刀了，我呜呜呜呜','泪点','这是一部很差的电影',
        '墨菲定律','好可爱！！！！！','一起上岸','冲鸭','加油！上岸！','上岸，就是现在','吾辈何以为战',
        '这我熟','这背景音乐，挺应景','这个配音，太棒了','道法自然','成龙','栓Q','宿命不知','翻译过来：人类是有极限的',
        '我醒了','我悟了','是偶然，是必然','老爹：密集不重要','人人都是食神','相信','币有了','备战高考',
        '你必须忘掉过去的一切','音响来了','这顿心灵鸡汤，有被喂到','前程似锦','存在主义'
      ]
      const barrageAvatars=[
        'https://jxxt-1257689580.cos.ap-chengdu.myqcloud.com/base64_upload_662801660894026?imageMogr2/crop/216x216/gravity/center',
        'https://jxxt-1257689580.cos.ap-chengdu.myqcloud.com/base64_upload_911801656927249?imageMogr2/crop/216x216/gravity/center',
        'https://jxxt-1257689580.cos.ap-chengdu.myqcloud.com/base64_upload_258651660897206?imageMogr2/crop/216x216/gravity/center',
        'https://jxxt-1257689580.cos.ap-chengdu.myqcloud.com/base64_upload_783781661154005?imageMogr2/crop/216x216/gravity/center',
'https://jxxt-1257689580.cos.ap-chengdu.myqcloud.com/base64_upload_113871639461704?imageMogr2/crop/216x216/gravity/center',
        'https://jxxt-1257689580.cos.ap-chengdu.myqcloud.com/base64_upload_430961657529896?imageMogr2/crop/216x216/gravity/center',
        'https://jxxt-1257689580.cos.ap-chengdu.myqcloud.com/base64_upload_996711657355741?imageMogr2/crop/216x216/gravity/center',
        'https://jxxt-1257689580.cos.ap-chengdu.myqcloud.com/base64_upload_864541660749680?imageMogr2/crop/216x216/gravity/center',
        'https://jxxt-1257689580.cos.ap-chengdu.myqcloud.com/base64_upload_725581661168586?imageMogr2/crop/216x216/gravity/center',
        'https://jxxt-1257689580.cos.ap-chengdu.myqcloud.com/base64_upload_967711654506684?imageMogr2/crop/216x216/gravity/center',
        'https://jxxt-1257689580.cos.ap-chengdu.myqcloud.com/base64_upload_743401639464714?imageMogr2/crop/216x216/gravity/center',
        'https://jxxt-1257689580.cos.ap-chengdu.myqcloud.com/base64_upload_685671660740238?imageMogr2/crop/216x216/gravity/center',
        'https://jxxt-1257689580.cos.ap-chengdu.myqcloud.com/base64_upload_769271657536837?imageMogr2/crop/216x216/gravity/center',
        'https://jxxt-1257689580.cos.ap-chengdu.myqcloud.com/base64_upload_594591645151776?imageMogr2/crop/216x216/gravity/center',
        'https://jxxt-1257689580.cos.ap-chengdu.myqcloud.com/base64_upload_483441660532837?imageMogr2/crop/216x216/gravity/center',
        'https://jxxt-1257689580.cos.ap-chengdu.myqcloud.com/base64_upload_806151660275127?imageMogr2/crop/216x216/gravity/center',
        'https://jxxt-1257689580.cos.ap-chengdu.myqcloud.com/base64_upload_212811654506578?imageMogr2/crop/216x216/gravity/center',
        'https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLmwiaTw5qEF7xhGENXjMPWfx9cGKicnGibMWf3sHkIEKBRLeGnmpFQF4YiaIoicPmNdziacn17PpUJFRzw/132',
        'https://img1.doubanio.com/icon/u205338693-19.jpg',
        'https://img9.doubanio.com/icon/u164055752-5.jpg',
        'https://jxxt-1257689580.cos.ap-chengdu.myqcloud.com/base64_upload_867851661133049?imageMogr2/crop/216x216/gravity/center',
        'https://jxxt-1257689580.cos.ap-chengdu.myqcloud.com/base64_upload_720251661111795?imageMogr2/crop/216x216/gravity/center',
        'https://jxxt-1257689580.cos.ap-chengdu.myqcloud.com/628665b9c5a46b02c7cf62d2e3198f74.png?imageMogr2/crop/216x216/gravity/center',
        'https://jxxt-1257689580.cos.ap-chengdu.myqcloud.com/base64_upload_329221660786827?imageMogr2/crop/216x216/gravity/center'
      ]
      let content=Math.floor(Math.random() * barrageContents.length )
      let hasAvatar=Math.floor(Math.random() * 10 + 1)>3
      let avatar=Math.floor(Math.random() * barrageAvatars.length )
     let barrage=  {
        content:barrageContents[content],
      }
      if(hasAvatar) barrage['avatar']=barrageAvatars[avatar]
      return  barrage
    },
    close(){
      tsbApi.window.close()
    },
    async getList() {

    },
    getId() {

    },
    reload(){
      window.location.reload()
    },
    pause(){
      $manager.running?$manager.stop():$manager.start()
      $manager.each((ba)=>{
        ba.paused?ba.resume():ba.pause()
      })
    },
    openShop(name = 'chrome') {
      ipc.send('openExtShop', {
        name
      })
    }
  }
}
</script>

<template>
  <div id="danmuWrapper" class="barrage-container" style="border-radius: 8px;height: calc(100vh - 30px)">

  </div>
  <div id="controller" class="operation" style="text-align: center">
    <a-button type="ghost" @click="reload">重载</a-button>
    <a-button type="ghost" @click="pause">暂停</a-button>
    <a-button type="ghost" @click="close">关闭</a-button>
  </div>
</template>
<style>
.barrage-style{
  border-radius: 100px;
  background: rgba(0,0,0,0.5);
  color: white;
  padding: 5px 15px;
  vertical-align: middle;
  line-height: 28px;
}
.barrage-avatar{
  border-radius: 100%;
  width: 26px;
  height: 26px;
  float: left;
  margin-left: -5px;
  margin-right:8px;
  vertical-align: middle;
}
html, body {
  overflow: hidden !important;
  background-color: #00000000 !important;
}
</style>
<style scoped lang="scss">
.barrage-container{
  &:hover{
    background: rgba(0,0,0,0.3);
  }
  background: rgba(0,0,0,0);
}
body{
  &:hover{
    .barrage-container{
      -webkit-app-region: drag;
    }
    .operation{
      display: block;
    }
  }
  .operation{
    display: none;
  }
}
.scroller-wrapper {
  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #ffffff;
    border-radius: 2px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgb(176, 176, 176);
    border-radius: 20px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #747474;
  }

  &::-webkit-scrollbar-corner {
    background: #f6f6f6;
  }
}


</style>
