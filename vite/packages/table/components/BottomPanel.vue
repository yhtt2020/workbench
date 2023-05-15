<template>
  <div class="bottom-panel mb-3 flex flex-row items-center justify-center w-full" style="text-align: center"
       @contextmenu.stop="showMenu">
    <div v-if="isMain" class="common-panel user s-bg" style="display: inline-block;vertical-align: top">
      <div v-if="!userInfo">
        <div @click="login" style="padding: 0.5em">
          <a-avatar :size="54">未登录</a-avatar>
          <div>
          </div>
          <div>
          </div>
        </div>
      </div>
      <div v-else :style="{width:settings.enableChat && !simple?'23em':(simple?'4.5em':'11em')}">
        <a-row class="pointer" @click="social">
          <a-col class="user-info" :span="settings.enableChat && !simple?10:24"
                 style="padding: 0.6em;position:relative;">
            <a-row style="text-align: left" :gutter="10">
              <a-col>
                <a-badge  style="border:none;" :count="totalCount">
                <a-avatar :src="userInfo.avatar" :size="50">{{ userInfo.nickname }}</a-avatar>
                </a-badge>
              </a-col>
              <a-col v-if="!simple" @click.stop="goMy()" style="position: relative">
                <span ref="minute" class="tip">+1</span>
                <div style="padding-top: 0.2em;">
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
          <a-col class="chat" v-if="settings.enableChat && !simple" :span="14"
                 style="text-align: left;padding-top: 0.5em;line-height: 1.75">
            <div style="font-size: 13px;" v-if="messages.length===0">
              <div class="pointer ml-3" @click.stop="enterIM">
                <a-row :gutter="10">
                  <a-col :span="6" class="pt-2">
                    <a-avatar src="https://up.apps.vip/logo/group.png?t=2"></a-avatar>
                  </a-col>
                  <a-col :span="18" class="pt-1">
                    <div class="text font-bold">
                      轻聊
                    </div>
                    <div>举杯，同是科技咖</div>
                  </a-col>
                </a-row>

              </div>
            </div>
            <div class="pointer" @click.stop="enterIM">
              <div v-for="message in messages" class="text-more">{{ message.title }}：{{ message.body }}</div>
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
    <div class=" flex flex-row  items-center pl-6 s-bg"
         style="border-radius: 8px; height: 73px;overflow: hidden;margin-right: 10px">
      <div style="overflow: hidden;overflow-x: auto;"
           class="flex flex-row items-center  flex-nowrap scroll-content mr-6" ref="content">
        <div v-if="navigationList.length<=0" style="height: 56px;">

        </div>
        <div class="pointer mr-3 mr-6" style="white-space: nowrap;display: inline-block" v-for="item in navigationList"
             @click="clickNavigation(item)" v-else>
          <div style="width: 56px;height:56px;" v-if="item.type==='systemApp'"
               class="s-item flex justify-center items-center rounded-lg">
            <Icon :icon="item.icon" style="width: 32px;height: 32px;color:rgba(255, 255, 255, 0.4);"></Icon>
          </div>
          <div v-else style="width: 45px;height: 45px;" class="flex justify-center items-center">
            <a-avatar :size="40" shape="square" :src="item.icon"></a-avatar>
          </div>
        </div>
      </div>


      <div @click="appChange" v-if="isMain" style="flex-shrink:0;border-left: 1px solid rgba(255, 255, 255, 0.2);width: 72px"
           class="flex justify-center items-center  h-2/3 pointer">
        <Icon icon="fuzhi" style="width: 40px;height: 40px;color: white;margin-left: 5px;margin-bottom: 3px" ></Icon>
        <span style="position: absolute;width: 48px;height: 48px;text-align: center;line-height: 48px;font-weight: bold;font-size: 18px">{{runningApps.length+runningTableApps.length}}</span>
      </div>

    </div>
    <template v-if="!simple && isMain">
      <a-badge-ribbon v-if="!team.status" text="新功能" style="right:2px">
        <div @click="toggleTeam" class="common-panel s-bg pointer "
             style="margin-left: 0;padding:0.4em !important;min-width: 6em;">
          <Icon class="mt-2 mb-0 " icon="smile" style="fill:#d7d7d7"></Icon>
          <div class="mb-0 mt-0"> 小队
            <div v-if="true" style="display: inline-block;position: relative">
            </div>
          </div>
        </div>
      </a-badge-ribbon>
      <div v-else @click="toggleTeam" class="common-panel s-bg pointer "
           style="margin-left: 0;padding:0.4em !important;min-width: 6em;margin-top: 0">
        <Icon class="mt-2 mb-0 " icon="smile" style="fill:#d7d7d7"></Icon>
        <div class="mb-0 mt-0"> 小队
          <div v-if="true" style="display: inline-block;position: relative">
          </div>
        </div>
      </div>
    </template>

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
        <div @click="editNavigation" class="btn relative">
          <Icon style="font-size: 3em" icon="tianjia1"></Icon>
          <div><span>编辑</span></div>
          <GradeSmallTip powerType="bottomNavigation" @closeDrawer="closeDrawer"></GradeSmallTip>
        </div>
      </a-col>
    </a-row>
  </a-drawer>

  <transition name="fade">
    <div class="home-blur fixed inset-0" style="z-index: 999" v-if="quick">
      <EditNavigation @setQuick="setQuick"></EditNavigation>
    </div>
  </transition>

  <div class="home-blur fixed inset-0" style="z-index: 999" v-if="changeFlag " @click="closeChangeApp">
    <ChangeApp @closeChangeApp="closeChangeApp" :full="full" @setFull="setFull"></ChangeApp>
  </div>
  <TeamTip :key="teamKey" v-model:visible="showTeamTip"></TeamTip>
</template>

<script>
import PanelButton from './PanelButton.vue'
import { appStore } from '../store'
import { cardStore } from '../store/card'
import { mapWritableState, mapActions } from 'pinia'
import Template from '../../user/pages/Template.vue'
import { ThunderboltFilled } from '@ant-design/icons-vue'
import { Modal } from 'ant-design-vue'
import SidePanel from './SidePanel.vue'
import SecondPanel from './SecondPanel.vue'
import GradeSmallTip from './GradeSmallTip.vue'
import {isMain} from '../js/common/screenUtils'

const { messageModel } = window.$models
import EditNavigation from './bottomPanel/EditNavigation.vue'
import ChangeApp from './bottomPanel/ChangeApp.vue'
import ScrolX from './ScrolX.vue'

import TeamTip from './TeamTip.vue'
import { teamStore } from '../store/team'
import { messageStore } from '../store/message'
import { appsStore } from '../store/apps'

export default {
  name: 'BottomPanel',
  components: {
    TeamTip,
    SecondPanel,
    SidePanel,
    Template,
    PanelButton,
    ThunderboltFilled,
    EditNavigation,
    ChangeApp,
    ScrolX,
    GradeSmallTip
  },
  data () {
    return {

      lastTime: 0,
      visibleTrans: false,
      full: false,
      //显示小组提示
      showTeamTip: false,
      teamKey: Date.now(),
      updateMessageTimer:null,

      timer: null,
      messages: [],
      tipped: false,
      menuVisible: false,
      quick: false,
      scrollbarSettings: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: true,
        suppressScrollX: false,
        wheelPropagation: true,
      },
      changeFlag: false,
      //screenWidth: document.body.clientWidth
    }
  },
  unmounted () {

    let that = this
    window.removeEventListener('resize', that.checkScroll)
    clearInterval(this.updateMessageTimer)
  },
  mounted () {
    // let inserted=localStorage.getItem('insertBird')
    // if(!inserted){
    //   this.navigationList.unshift( {
    //     icon: 'http://a.apps.vip/icons/flappy.jpg',
    //     type:'coolApp',
    //     name: 'Mlappy Bird',
    //     summary: '和小伙伴们一起飞。',
    //     needInstall: false,
    //     data: {
    //       theme: '#030c13',
    //       name: 'mlappyBird',
    //       url: 'http://bird.apps.vip/?',
    //       background: false,
    //       type:'game',
    //       scale:160
    //     }
    //   })
    //   localStorage.setItem('insertBird','1')
    // }
    this.getMessageIndex().then()
    //每3分钟刷新一次消息
    this.updateMessageTimer=setInterval(()=>{
      this.getMessageIndex().then()
    },180000)
    let that = this
    this.checkScroll()
    // const that = this
    // window.onresize = function() {
    //   return function(){
    //     window.screenWidth = document.body.clientWidth;
    //     that.screenWidth = window.screenWidth
    //   }()
    // }
    window.addEventListener('resize',
      that.checkScroll
    )
    let content = this.$refs.content
    content.addEventListener('wheel', (event) => {
      event.preventDefault()
      content.scrollLeft += event.deltaY
    })
    this.setMinute()
    this.lastTime = Number(localStorage.getItem('lastBarrageMessageTime'))
    this.loadMessages()
    setInterval(() => {
      this.loadMessages()
    }, 10000)
  },
  computed: {
    ...mapWritableState(appStore, ['userInfo', 'settings', 'lvInfo', 'simple']),
    ...mapWritableState(appsStore,['runningApps','runningTableApps']),
    ...mapWritableState(teamStore, ['team', 'teamVisible']),
    ...mapWritableState(cardStore, ['navigationList', 'routeParams']),
    ...mapWritableState(messageStore,['messageIndex','totalCount']),
    isMain(){
      return isMain()
    },
  },
  watch: {
    navigationList: {
      handler () {
        this.checkScroll()
        // this.$nextTick(()=>{
        //   console.log(this.$refs.content.offsetHeight-this.$refs.content.clientHeight>0)
        //   if(this.$refs.content.offsetHeight-this.$refs.content.clientHeight>0){
        //     this.$refs.content.style.marginTop='17px'
        //   }else{
        //     this.$refs.content.style.marginTop='0px'
        //   }
        // })

      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    ...mapActions(teamStore, ['updateMy']),
    ...mapActions(messageStore,['getMessageIndex']),
    async toggleTeam () {
      await this.updateMy(0)
      if (this.team.status === false) {
        this.teamKey = Date.now()
        this.showTeamTip = true
      } else {
        this.teamVisible = !this.teamVisible
      }

    },
    closeDrawer () {
      this.menuVisible = false
    },
    checkScroll () {
      this.$nextTick(() => {
        if (this.$refs.content.offsetHeight - this.$refs.content.clientHeight > 0) {
          this.$refs.content.style.marginTop = '17px'
        } else {
          this.$refs.content.style.marginTop = '0px'
        }
      })
    },
    goMy () {
      this.$router.push({ name: 'socialMy' })
    },
    ...mapActions(appStore, ['setUser']),
    setFull (value) {
      this.full = value
    },
    appChange () {
      this.routeParams.url && ipc.send('hideTableApp', { app: JSON.parse(JSON.stringify(this.routeParams)) })
      this.changeFlag = true
    },
    closeChangeApp () {
      this.routeParams.url && setTimeout(() => {this.$router.push({ name: 'app', params: this.routeParams })}, 400)
      this.changeFlag = false
    },
    showMenu () {
      this.routeParams.url && ipc.send('hideTableApp', { app: JSON.parse(JSON.stringify(this.routeParams)) })
      this.menuVisible = true
    },
    onClose () {
      this.routeParams.url && this.$router.push({ name: 'app', params: this.routeParams })
      this.menuVisible = false
    },
    editNavigation () {
      this.quick = true
      this.menuVisible = false
    },
    setQuick () {
      this.quick = false
    },
    setMinute () {
      setInterval(() => {
        this.$refs.minute.classList.add('move')
        this.lvInfo.remainMinute--
        if (this.lvInfo.remainMinute <= 0) {
          this.lvInfo.remainHour--
          if (this.lvInfo.remainHour < 0 && this.tipped === false) {
            this.tipped = true
            ipc.send('getDetailUserInfo')
            Modal.info({
              title: '升级提示',
              content: '恭喜您等级提升',
            })
          }
          this.lvInfo.remainMinute = 59
        }
        this.timer = setTimeout(() => {
          this.$refs.minute.classList.remove('move')
        }, 1000)
      }, 60000)
    },
    async loadMessages () {
      this.messages = await messageModel.allList()
      this.messages.forEach(mes => {
        //修正一下登录小助手的
        if (mes.title === '登录小助手') {
          mes.body = '[提醒]'
        }
      })
      if (this.lastTime === 0) {
        let barrages = this.messages.slice(0, 10)
        window.$manager.sendChat(barrages)
        if (barrages.length > 0) {
          this.lastTime = barrages[0].create_time//重新设置指标
        } else {
          this.lastTime = Date.now()
        }
      } else {
        let readyToSend = this.messages.filter(mes => {
          return mes.create_time > this.lastTime
        })
        //readyToSend.splice(0,10)
        if (readyToSend.length > 0) {
          window.$manager.sendChat(readyToSend)
        }
        if (this.messages.length > 0) {
          this.lastTime = this.messages[0].create_time//重新设置指标
        } else {
          this.lastTime = Date.now()
        }

        localStorage.setItem('lastBarrageMessageTime', this.lastTime)
      }
      if (this.messages.length > 2) {
        this.messages.splice(2)
      }
    },
    login () {
      tsbApi.user.login((data) => {
        ipc.send('getDetailUserInfo')
      })
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
    social () {
      if(this.totalCount){
        this.$router.push({ name: 'message' })
      }else{
        this.$router.push({ path: '/social/' })
      }
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
        params: {
          fullScreen: false,
          theme: 'transparent',
          name: 'chat',
          package: 'com.thisky.chat',
          url: 'http://im.xiangtian.ren',
          preload: '../preload/chatPreload',
          background: true,
          node: true,
          security: true
        }
      })
    },
    clickNavigation (item) {
      switch (item.type) {
        case 'systemApp':
          if (item.event === 'fullscreen') {
            if (this.full) {
              this.full = false
              tsbApi.window.setFullScreen(false)
            } else {
              this.full = true
              tsbApi.window.setFullScreen(true)
            }
          } else if (item.event === '/status') {
            if (this.$route.path === '/status') {
              this.$router.go(-1)
            } else {
              this.$router.push({ path: '/status' })
            }
          } else if (item.data) {
            this.$router.push({
              name: 'app',
              params: item.data
            })
          } else {
            this.$router.push({ name: item.event })
          }
          break
        case 'coolApp':
          this.$router.push({
            name: 'app',
            params: item.data
          })
          break
        case 'localApp':
          require('electron').shell.openPath(item.path)
          break
        case 'lightApp':
          ipc.send('executeAppByPackage', { package: item.package })
          break
        default:
          require('electron').shell.openPath(item.path)
      }
    }
  }
}
</script>
<style>

</style>
<style lang="scss" scoped>
.common-panel{
  margin-bottom: 0;
}
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

//
//@media screen and (max-height: 510px) {
//  .bottom-panel {
//    zoom:0.9;
//
//  }
//  .chat{
//    display: none;
//  }
//  .user-info{
//    width: 100%;
//  }
//  .user{
//    width: 12.5em;
//  }
//}
//@media screen and (min-height: 511px) and (max-height: 550px) {
//  .bottom-panel{
//    zoom:0.9;
//
//  }
//  .chat{
//    display: none;
//  }
//  .user-info{
//    width: 100%;
//  }
//  .user{
//    width: 12.5em;
//  }
//}
//@media screen and (min-height: 551px) and (max-height: 610px) {
//  .bottom-panel {
//    zoom: 0.9;
//  }
//  .chat{
//    display: none;
//  }
//  .user-info{
//    width: 100%;
//  }
//  .user{
//    width: 12.5em;
//  }
//}
.tip {
  position: absolute;
  top: 0;
  right: -25px;
  opacity: 0;
  background: rgba(0, 0, 0, 0.25);
  border-radius: 100px;
  width: 30px;
  text-align: center;
  line-height: 15px;
}

.move {

  animation: moveUp 0.8s;
}

@keyframes moveUp {
  from {
    top: 20px;
    opacity: 100;
  }
  to {
    top: -10px;
    opacity: 0;
  }
}

.scroll-content {
  :last-child {
    margin-right: 0;
  }
}
</style>
