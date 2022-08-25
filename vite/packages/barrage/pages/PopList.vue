<script lang="ts">
import { createVNode } from 'vue';
import {
  CloseCircleOutlined,
  RedoOutlined,
  SettingOutlined,
  LockOutlined,
  SendOutlined,
  SmileOutlined,

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
import { message } from 'ant-design-vue';

export default {
  components: {
    CloseCircleOutlined,
    RedoOutlined,
    SettingOutlined,
    LockOutlined,
    SendOutlined,
    SmileOutlined,


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
      user:{},

      CONST:null,
      barrages:[],

      channelType:false,
      pageUrl:'',
      content:'',
      inputPopVisible:false,
    }
  },

  async mounted() {
    let userResult=await tsbApi.user.get()
    if(userResult.status===0){
      this.user=null
    }else{
      this.user=userResult.data
    }

    window.$message=message


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
      interval:1,
      times:[20,25],
      hooks: {
        send (manager, data) {
        },

        barrageCreate (barrage, node) {
          if (!barrage.isSpecial) {
            // 设置弹幕内容和样式
            node.classList.add('barrage-style')
            if(barrage.data.self){
              node.style.background='black'
              node.style.fontWeight='bold'
            }
          }
        },
        barrageAppend (barrage, node) {
          //node.textContent = barrage.data.content
          node.textContent =barrage.data.self?'我：' +barrage.data.content:barrage.data.content
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
    // manager.setOptions({
    //   container:document.getElementById('danmuWrapper'),
    //   limit:50
    // })
    tsbApi.barrage.onUrlChanged(this.changeUrl) //挂载url变化事件
    this.pageUrl=(await tsbApi.tabs.current()).sourceUrl
    this.getList()


    // setInterval(()=>{
    //   manager.sendSpecial({
    //     data:this.makeBarrage(),
    //     duration: 5,
    //     direction: 'right',
    //     position (barrage) {
    //       return {
    //         x: (manager.containerWidth - barrage.getWidth()) / 2,
    //         y: (manager.containerHeight- barrage.getHeight()) / 2
    //       }
    //     },
    //     hooks: {
    //       create (barrage) {
    //         barrage.node.style.background = 'red'
    //       }
    //     }
    //   })
    // },3000)

    window.$manager=manager

    manager.start()
    manager.show()
  },
  methods: {
    async changeUrl(url) {
      this.pageUrl = url
      await this.getList()
    },
    async getList(){
      this.CONST=tsbApi.barrage.CONST
      try{
        let rs=await tsbApi.barrage.getList(this.CONST.CHANNEL.PUBLIC,this.pageUrl)
        this.barrages=rs.data
        if(rs.status){
          $manager.clear()
          $manager.send(this.barrages)
          $manager.start()
        }else{
          message.error('获取弹幕接口返回错误，可能是服务器正在维护，请稍后再试。')
        }
      }catch (e) {
        console.error(e)
        message.error('获取弹幕意外错误。')
      }
    },
    login(){
      tsbApi.user.login((userInfo)=>{
        this.user={
          user_info:userInfo
        }
      })
    },
    /**
     * 发射弹幕
     */
    async send() {
      let allowProtocol=['ts','http','https']
      if(!allowProtocol.some(protocol=>{
        return this.pageUrl.startsWith(protocol+'://')
      })){
        message.error('当前页面不允许发送弹幕')
        return
      }
      if (this.content === '') {
        return
      }
      let data = {
        channel_type: this.channelType?this.CONST.CHANNEL.GROUP:this.CONST.CHANNEL.PUBLIC,
        content: this.content,
        page_url: this.pageUrl,

      }
      try{
        let rs = await tsbApi.barrage.add(data)
        if(rs.status===1){
          $manager.send({
            avatar: this.user.user_info.avatar,
            content: this.content,
            self: true,
          })
          this.content = ''
          this.inputPopVisible = false
          message.success('弹幕装填成功。')
        }else{
          message.error({content:'弹幕发布失败，服务器返回错误。'})
        }
      }catch (e) {
        console.warn(e)
        message.error({content:'弹幕发布失败，请检查网络情况。'})
      }
    },
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
    lock(){
      message.success('锁定弹幕窗口成功。再次点击工具栏弹幕按钮可解锁。')
      document.body.classList.remove('active')
      tsbApi.barrage.lock()
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
    },
    toggleInput(){
      if(this.user){
        setTimeout(()=>{
          document.getElementById('inputArea').focus()
          document.getElementById('inputArea').select()
        },500)
      }
    }
  }
}
</script>

<template>
  <div id="danmuWrapper" class="barrage-container" style="border-radius: 8px;height: calc(100vh - 30px)">

  </div>
  <div id="controller" class="operation" style="text-align: center;margin-top: 6px">
    <a-popover v-model:visible="inputPopVisible"  trigger="click">
    <template #content>
      <div style="width: 350px;-webkit-app-region:no-drag" :style="{height:this.user?'100px':'130px'}">
        <div><img style="width: 22px;vertical-align: top" src="../assets/hot.svg"> 发弹幕
          &nbsp;
          <a-switch v-if="this.user" v-model:checked="channelType" size="small" checked-children="团队频道" un-checked-children="公共频道"></a-switch>
          <div style="float: right"><a-avatar v-if="this.user" :src="user.user_info.avatar"></a-avatar></div>
        </div>
        <div style="margin-top: 10px;margin-bottom: 15px">

          <a-input @keypress.enter="send" v-if="this.user"
                      v-model:value="content" spellcheck="false" @visibleChange="toggleInput" id="inputArea"
                      class="scroller-wrapper" style="resize: none;overflow: hidden !important;"
                      :allowClear="true" :maxlength="30"  :bordered="false"
                      placeholder="发一条弹幕吧~"

          />
          <div v-else style="width: 100%;height: 60px;font-size: 13px;color: #999;text-align: center;background: rgba(128,128,128,0.15);border-radius:4px;line-height: 24px;padding-top: 5px">
            <strong>未登录</strong>用户无法发布弹幕<p>请 <a-button type="primary" size="small" @click="login">登录</a-button> 后重试</p>
          </div>
        </div>
        <div style="clear: both;position: absolute;bottom: 25px;width: 92%">
          <div style="float: left">
            <a-button size="small"  :disabled="!this.user"><smile-outlined /></a-button>
          </div>
          <div style="float: right">
            <a-select v-if="false" size="small">选择团队</a-select> &nbsp;
            <a-button @click="send" size="small" :disabled="!this.user">发送</a-button>
          </div>
        </div>
      </div>
    </template>
    <a @click="toggleInput" class="shadow-button"><send-outlined /> 发射</a>
    </a-popover>
    <a class="shadow-button" @click="lock"><lock-outlined /> 锁定</a>
    <a class="shadow-button"><setting-outlined /> 设置</a>
<!--    <a class="shadow-button" type="ghost" @click="pause">暂停</a>-->
    <a class="shadow-button" type="ghost" @click="close"><CloseCircleOutlined/> 关闭</a>
    <a class="shadow-button" @click="reload"><redo-outlined /> 刷新</a>
  </div>
</template>
<style>
.barrage-style{
  user-select: none;
  border-radius: 100px;
  background: rgba(0,0,0,0.5);
  color: white;
  padding: 3px 15px;
  padding-right: 15px;
  vertical-align: middle;
  line-height: 28px;
}
.barrage-avatar{
  border-radius: 100%;
  width: 30px;
  height: 30px;
  float: left;
  margin-left: -10px;
  margin-right:6px;
  vertical-align: text-top;
}
html, body {
  overflow: hidden !important;
  background-color: #00000000 !important;
}
</style>
<style scoped lang="scss">
.shadow-button{
  background: rgba(0,0,0,0.5);
  color: white;
  border-radius: 6px;
  margin-left: 5px;
  margin-right: 5px;
  padding: 5px 10px;
  cursor: pointer;
  &:hover{
    color: rgba(255,255,255,.7);
  }
}
.operation{
  display: none;
}
.active{
.barrage-container{
  &:hover{
    background: rgba(0,0,0,0.3);
  }
  background: rgba(0,0,0,0);
}
  &:hover{
    .barrage-container{
      -webkit-app-region: drag;
    }
    .operation{
      display: block;
    }
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
