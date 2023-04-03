<template>
  <div class="bottom-panel flex flex-row items-center justify-center" style="position: fixed;padding:10px;bottom:0;width: 100vw;text-align: center" @contextmenu.stop="showMenu">
    <div class="common-panel user" style="display: inline-block;vertical-align: top">
      <div v-if="!userInfo">
        <div @click="login" style="padding: 0.5em">
          <a-avatar :size="54">未登录</a-avatar>
          <div>
          </div>
          <div>
          </div>
        </div>
      </div>
      <div v-else :style="{width:settings.enableChat?'23em':'11em'}">
        <a-row class="pointer" @click="levelDetail">
          <a-col class="user-info"  :span="settings.enableChat?10:24" style="padding: 0.6em;position:relative;">
            <a-row  style="text-align: left" :gutter="10">
              <a-col>
                <a-avatar :src="userInfo.avatar" :size="50">{{ userInfo.nickname }}</a-avatar>
              </a-col>
              <a-col>
                <div style="padding-top: 0.2em">
                  <span style="font-size: 0.8em;">等级</span> {{ lvInfo.lv }}级 <br>
                  <span>
                    <a-tooltip>
                  <a-progress strokeColor="#666" trailColor="#4d4d4d" :percent="lvInfo.percentage" :showInfo="false"
                              style="width:4em"/>
                  <template #title>
                    <thunderbolt-filled class="thunder" style="color: rgba(255,140,44,0.98);vertical-align: middle"/>
                    <span
                      style="color: #f3f3f3;font-size: 12px;vertical-align: middle">{{
                        lvInfo.remainHour
                      }}小时{{ lvInfo.remainMinute }}分后升级</span>
                  </template>
                </a-tooltip>
              </span>

                </div>

                <!--                <span class="ts-grade-crown" v-for="item in this.userInfo.onlineGradeIcons.crown">-->
                <!--                  <img :src="item.icon" alt="" style="width: 20px; height: 20px">-->
                <!--                </span>-->
                <!--                <span class="ts-grade-sun" v-for="item in this.userInfo.onlineGradeIcons.sun">-->
                <!--                  <img :src="item.icon" alt="" style="width: 20px; height: 20px">-->
                <!--                </span>-->
                <!--                <span class="ts-grade-moon" v-for="item in this.userInfo.onlineGradeIcons.moon">-->
                <!--                  <img :src="item.icon" alt="" style="width: 20px; height: 20px">-->
                <!--                </span>-->
                <!--                <span class="ts-grade-star" v-for="item in this.userInfo.onlineGradeIcons.star">-->
                <!--                  <img :src="item.icon" alt="" style="width: 20px; height: 20px">-->
                <!--                </span>-->
              </a-col>
            </a-row>


          </a-col>
          <a-col class="chat" v-if="settings.enableChat" :span="14" style="text-align: left;padding-top: 0.5em;line-height: 1.75">
            <div class="pointer" @click.stop="enterIM">
              <div v-for="message in messages" class="text-more">{{message.title}}：{{message.body}}</div>
            </div>
          </a-col>
        </a-row>
      </div>
    </div>
<!--    <div class="common-panel" style="display: inline-block">-->
<!--      <PanelButton :onClick="openSetting" icon="shezhi" title="设置"></PanelButton>-->
<!--      <PanelButton icon="yidongwenjianjia" :onClick="transFile" title="传文件"></PanelButton>-->
<!--      <PanelButton :onClick="openStatus" icon="tiaoduguanli" title="调整"></PanelButton>-->
<!--      <PanelButton :onClick="setFullScreen" icon="daochu" title="全屏"></PanelButton>-->
<!--      <PanelButton icon="suoding" title="锁屏" :onClick="lock"></PanelButton>-->
<!--      <PanelButton :onClick="power" icon="tuichu" title="电源"></PanelButton>-->
<!--    </div>-->
    <div class="w-1/2 flex flex-row  items-center px-2" style="background: #282828;border-radius: 8px">

      <ScrolX :height="75" style="display: flex; flex-direction: row">
        <div v-if="navigationList.length<=0" style="height: 68px;">

        </div>
        <div class="pointer" style="white-space: nowrap;display: inline-block" v-for="item in navigationList" @click="clickNavigation(item)" v-else>
              <div style="width: 75px;height: 75px;display: flex;justify-content: center;align-items: center;" v-if="item.type==='systemApp'">
                <Icon :icon="item.icon" style="width: 32px;height: 32px;color:rgba(255, 255, 255, 0.4);" ></Icon>
              </div>
          <div v-else style="width: 75px;height: 75px;display: flex;justify-content: center;align-items: center;">
            <a-avatar :size="40"  shape="square" :src="item.icon" ></a-avatar>
          </div>

        </div>
      </ScrolX>

    <div style="border-left: 1px solid rgba(255, 255, 255, 0.4);width: 62px;" class="flex justify-center items-center mx-2 h-2/3 pointer">
      <Icon icon="appstore-fill" style="width: 48px;height: 48px;color: white" @click="appChange"></Icon>
    </div>
  </div>
    <!--    <div style="display: inline-block">-->
    <!--      <a-row :gutter="10">-->
    <!--        <a-col :span="2">-->
    <!--          <a-row class="common-panel" style="width:5em">-->
    <!--            <PanelButton icon="#icon-shezhi" title="设置"></PanelButton>-->
    <!--          </a-row>-->
    <!--        </a-col>-->
    <!--        <a-col  :span="4" class="common-panel">-->
    <!--          <a-row>-->
    <!--            <a-col :span="12">-->
    <!--              <PanelButton icon="#icon-suoding" title="锁屏"></PanelButton>-->
    <!--            </a-col>-->
    <!--            <a-col  :span="12">-->
    <!--              <PanelButton icon="#icon-yidongwenjianjia" :onClick="transFile" title="传文件"></PanelButton>-->
    <!--            </a-col>-->
    <!--          </a-row>-->
    <!--        </a-col>-->
    <!--        <a-col  :span="4" class="common-panel">-->
    <!--          <a-row >-->
    <!--            <a-col  :span="12">-->
    <!--              <PanelButton icon="#icon-suoding" title="动态"></PanelButton>-->
    <!--            </a-col>-->
    <!--            <a-col  :span="12">-->
    <!--              <PanelButton icon="#icon-yidongwenjianjia" title="邮件"></PanelButton>-->
    <!--            </a-col>-->
    <!--          </a-row>-->
    <!--        </a-col>-->
    <!--        <a-col  :span="3">-->
    <!--          <a-row class="common-panel">-->
    <!--            &lt;!&ndash;          <span class="status-text">专注中</span>&ndash;&gt;-->
    <!--            <PanelButton icon="#icon-tiaoduguanli" title="调整"></PanelButton>-->
    <!--          </a-row>-->
    <!--        </a-col>-->


    <!--        &lt;!&ndash;      <a-col  :span="2">&ndash;&gt;-->
    <!--        &lt;!&ndash;        <a-row class="common-panel" style="width:4em" >&ndash;&gt;-->
    <!--        &lt;!&ndash;          <a-col><PanelButton icon="#icon-xiaoxi" title="消息"></PanelButton></a-col>&ndash;&gt;-->
    <!--        &lt;!&ndash;&lt;!&ndash;          <a-col> <PanelButton icon="#icon-tishi-xianxing" title="通知"></PanelButton></a-col>&ndash;&gt;&ndash;&gt;-->
    <!--        &lt;!&ndash;        </a-row>&ndash;&gt;-->
    <!--        &lt;!&ndash;      </a-col>&ndash;&gt;-->
    <!--        <a-col  :span="4">-->
    <!--          <a-row class="common-panel" style="width:10em" >-->
    <!--            <a-col>-->
    <!--              <PanelButton :onClick="setFullScreen" icon="#icon-daochu" title="全屏"></PanelButton>-->
    <!--            </a-col>-->
    <!--            <a-col>-->
    <!--              <PanelButton icon="#icon-tuichu" title="电源"></PanelButton>-->
    <!--            </a-col>-->
    <!--          </a-row>-->
    <!--        </a-col>-->
    <!--      </a-row>-->
    <!--    </div>-->

  </div>
  <div id="trans" v-show="visibleTrans"
       style="position:fixed;left: 0;top: 0;width: 100vw;height: 100vh;background: #2c2c2c">
    <a-button @click="visibleTrans=false" style="position:fixed;left: 10px;top: 10px">取消</a-button>
    <iframe id="transFrame" style="width:100vw;height: 100vh;border: none">

    </iframe>
  </div>
  <a-drawer
    :contentWrapperStyle="{backgroundColor:'#1F1F1F',height:'11em'}"
    :width="120"
    :height="120"
    class="drawer"
    :closable="false"
    placement="bottom"
    :visible="menuVisible"
    @close="onClose"
  >
    <a-row style="margin-top: 1em" :gutter="[20,20]">
      <a-col>
        <div @click="editNavigation" class="btn">
          <Icon style="font-size: 3em" icon="tianjia1"></Icon>
          <div><span>编辑</span></div>
        </div>
      </a-col>
    </a-row>
  </a-drawer>

  <transition name="fade">
    <div class="home-blur fixed inset-0" style="z-index: 999" v-if="quick">
      <EditNavigation @setQuick="setQuick"></EditNavigation>
    </div>
  </transition>
  <transition name="fade">
    <div class="home-blur fixed inset-0" style="z-index: 999" v-if="changeFlag" @click="closeChangeApp">
      <ChangeApp @closeChangeApp="closeChangeApp" :full="full" @setFull="setFull"></ChangeApp>
    </div>
  </transition>
</template>

<script>
import PanelButton from './PanelButton.vue'
import {appStore, tableStore} from '../store'
import { mapWritableState, mapActions } from 'pinia'
import Template from '../../user/pages/Template.vue'
import { ThunderboltFilled } from '@ant-design/icons-vue'
import EditNavigation from './bottomPanel/EditNavigation.vue'
import ChangeApp from './bottomPanel/ChangeApp.vue'
import ScrolX from "./ScrolX.vue";
const { messageModel }=window.$models
export default {
  name: 'BottomPanel',
  components: { Template, PanelButton, ThunderboltFilled,EditNavigation,ChangeApp,ScrolX},
  data () {
    return {
      lastTime:0,
      visibleTrans: false,
      full: false,
      lvInfo: {},
      messages:[],
     menuVisible: false,
      quick:false,
      scrollbarSettings: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: true,
        suppressScrollX: false,
        wheelPropagation: true,
      },
      changeFlag:false
    }
  },
  mounted () {
    this.lastTime=Number(localStorage.getItem('lastBarrageMessageTime'))
    this.loadMessages()
    setInterval( ()=>{
      this.loadMessages()
    },10000)
    ipc.on('userInfo', (event, args) => {
      this.loading = false

      let lvInfo = {}
      lvInfo.lv = args.data.onlineGradeExtra.lv
      let current = this.gradeTableGenerate(64)[lvInfo.lv]
      let section = this.gradeTableGenerate(64)[lvInfo.lv + 1]
      let remain = section[0] * 60 - (args.data.onlineGradeExtra.minutes)
      lvInfo.remainHour = Math.floor(remain / 60)
      lvInfo.remainMinute = remain - (Math.floor(remain / 60) * 60)
      lvInfo.minute = args.data.onlineGradeExtra.minutes
      lvInfo.percentage = ((lvInfo.minute - current[0] * 60) / ((current[1] - current[0]) * 60)) * 100
      this.lvInfo = lvInfo
      this.setUser(args.data)
    })
    ipc.send('getDetailUserInfo')
  },
  computed: {
    ...mapWritableState(appStore, ['userInfo','settings']),
    ...mapWritableState(tableStore, ['navigationList'])
  },
  methods: {
    ...mapActions(appStore, ['setUser']),
    setFull(value){
        this.full = value
    },
    appChange(){
      this.changeFlag = true
    },
    closeChangeApp(){
      this.changeFlag = false
    },
    showMenu () {
      this.menuVisible = true
    },
    onClose () {
      this.menuVisible = false
    },
    editNavigation(){
      this.quick = true
      this.menuVisible = false
    },
    setQuick(){
      this.quick = false
    },
    async loadMessages(){
      this.messages=await messageModel.allList()
      this.messages.forEach(mes=>{
        //修正一下登录小助手的
        if(mes.title==='登录小助手'){
          mes.body='[提醒]'
        }
      })
      if(this.lastTime===0){
        let barrages=this.messages.slice(0,10)
        window.$manager.sendChat(barrages)
        this.lastTime=barrages[0].create_time
      }else{
        let readyToSend=this.messages.filter(mes=>{
          return mes.create_time>this.lastTime
        })
         //readyToSend.splice(0,10)
        if(readyToSend.length>0){
          window.$manager.sendChat(readyToSend)
        }
        this.lastTime=this.messages[0].create_time//重新设置指标
        localStorage.setItem('lastBarrageMessageTime',this.lastTime)
      }
      if(this.messages.length>2){
        this.messages.splice(2)
      }
    },
    login () {
      tsbApi.user.login((data) => {
        ipc.send('getDetailUserInfo')
      })
    },
    gradeTableGenerate (num) {
      let lvSys = {}
      for (let i = 0; i < num + 1; i++) {
        let arrLef = 0
        let arrRg = 0
        for (let j = 0; j < i; j++) {
          arrLef += 10 * (j + 2)
        }
        for (let k = 0; k < i + 1; k++) {
          arrRg += 10 * (k + 2)
        }
        arrRg -= 1
        lvSys[`${i}`] = [arrLef, arrRg]
      }
      delete lvSys['lv0']
      return lvSys
    },
    openSetting () {
      this.$router.push({ name: 'setting' })
    },
    openStatus () {
      if (this.$route.path === '/status') {
        this.$router.go(-1)
      } else {
        this.$router.push({ path: '/status' })
      }
    },
    levelDetail(){
      this.$router.push({ name: 'levelDetail' })
    },
    power () {
      this.$router.push({ path: '/power' })
    },
    lock () {
      this.$router.push({ path: '/lock' })
    },
    transFile () {
      //this.visibleTrans=true
      //document.getElementById('transFrame').src='https://szfilehelper.weixin.qq.com/'
      // console.log('发送消息')
      ipc.send('executeAppByPackage', { package: 'com.thisky.fileHelper' })
      this.$router.push({
        name: 'app',
        params: {
          theme: '#2c2c2c',
          name: 'fileHelper',
          url: 'https://szfilehelper.weixin.qq.com/',
          preload: 'fileHelper',
          background: false,
        }
      })

    },
    async setFullScreen () {
      // await tsbApi.window.isFullScreen()
      if (this.full) {
        this.full = false
        tsbApi.window.setFullScreen(false)
      } else {
        this.full = true
        tsbApi.window.setFullScreen(true)
      }

    },
    enterIM () {
      this.$router.push({
        name: 'app',
        params:{
          fullScreen: false,
          theme: 'transparent',
          name: 'chat',
          package:'com.thisky.chat',
          url: 'http://im.xiangtian.ren',
          preload: '../preload/chatPreload',
          background: true,
          node: true,
          security: true
        }
      })
    },
    clickNavigation(item){
        switch (item.type){
          case 'systemApp':if(item.event==='fullscreen'){
            if (this.full) {
              this.full = false
              tsbApi.window.setFullScreen(false)
            } else {
              this.full = true
              tsbApi.window.setFullScreen(true)
            }
          }else if(item.event==='/status'){
            if (this.$route.path === '/status') {
              this.$router.go(-1)
            } else {
              this.$router.push({ path: '/status' })
            }
          }else{
            this.$router.push({ name: item.event })
          }break;
          case 'coolApp':  this.$router.push({
            name: 'app',
            params: item.data
          });break;
          case 'localApp': require('electron').shell.openPath(item.path);break;
          case 'lightApp': ipc.send('executeAppByPackage',{package:item.package});break;
          default: require('electron').shell.openPath(item.path);
        }
    }
  }
}
</script>
<style>

</style>
<style scoped>

.btn {
  text-align: center;
}
.status-text {
  font-size: 1.5em;
  line-height: 3em;
  height: 3em;
  width: 6em;
  text-align: center;
}

.bottom-panel .common-panel {
  padding: 0.2em 1em 0.2em 1em !important;
}

.level-badge {
  left: 0;
  bottom: 0;
  border-radius: 100px;
  width: 2em;
  font-size: 1.1em;
  height: 2em;
  text-align: center;
  line-height: 2em;
  display: inline-block;
  background: rgba(42, 40, 40, 0.51);
}

.thunder {
  animation: twinkling 1.2s ease-in-out infinite;
}

@keyframes twinkling {
  0% {
    opacity: 0.5;
    filter: alpha(opacity=50);
  }

  50% {
    opacity: 1;
    filter: alpha(opacity=100);
  }

  100% {
    opacity: 0.5;
    filter: alpha(opacity=50);
  }
}


@media screen and (max-height: 510px) {
  .bottom-panel {
    zoom:0.9;

  }
  .chat{
    display: none;
  }
  .user-info{
    width: 100%;
  }
  .user{
    width: 12.5em;
  }
}
@media screen and (min-height: 511px) and (max-height: 550px) {
  .bottom-panel{
    zoom:0.9;

  }
  .chat{
    display: none;
  }
  .user-info{
    width: 100%;
  }
  .user{
    width: 12.5em;
  }
}
@media screen and (min-height: 551px) and (max-height: 610px) {
  .bottom-panel {
    zoom: 0.9;
  }
  .chat{
    display: none;
  }
  .user-info{
    width: 100%;
  }
  .user{
    width: 12.5em;
  }
}
</style>
