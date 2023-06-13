<template>
  <div class="bottom-panel mb-3 flex flex-row items-center justify-center w-full" style="text-align: center"
    @contextmenu.stop="showMenu">
    <!-- 快速搜索 底部 用户栏 -->
    <div  v-if="isMain && !simple" class="common-panel user s-bg"
      style="display: inline-block;vertical-align: top;margin-top: 0;background: var(--primary-bg);color: var(--primary-text);">
      <MyAvatar  :chat="true" :level="true"></MyAvatar>
    </div>
    <!--    <div class="common-panel" style="display: inline-block">-->
    <!--      <PanelButton :onClick="openSetting" icon="shezhi" title="设置"></PanelButton>-->
    <!--      <PanelButton icon="yidongwenjianjia" :onClick="transFile" title="传文件"></PanelButton>-->
    <!--      <PanelButton :onClick="openStatus" icon="tiaoduguanli" title="调整"></PanelButton>-->
    <!--      <PanelButton :onClick="setFullScreen" icon="daochu" title="全屏"></PanelButton>-->
    <!--      <PanelButton icon="suoding" title="锁屏" :onClick="lock"></PanelButton>-->
    <!--      <PanelButton :onClick="power" icon="tuichu" title="电源"></PanelButton>-->
    <!--    </div>-->
    <!-- 快速搜索 底部栏区域 -->
    <div :style="{paddingTop:simple?'0':'16px'}" v-show="navigationToggle[2]" class=" flex flex-row  items-center pl-6 s-bg"
      style=" border-radius: 8px; height: 73px;overflow: hidden;margin-right: 10px;background: var(--primary-bg);color: var(--primary-text);">
      <div style="overflow: hidden;overflow-x: auto;" class="flex flex-row items-center  flex-nowrap scroll-content mr-6"
        ref="content">
        <div v-if="footNavigationList.length <= 0" style="height: 56px;">
        </div>
        <a-tooltip v-else :title="item.name" v-for=" item  in  footNavigationList ">
          <div class="pointer mr-3 mr-6" style="white-space: nowrap;display: inline-block;" @click="clickNavigation(item)">
            <div style="width: 56px;height:56px;background: var(--active-bg);" v-if="item.type === 'systemApp'"
              class="s-item flex justify-center items-center rounded-lg">

              <Icon :icon="item.icon" class="test"
                style="width: 32px;height: 32px;color:rgba(255, 255, 255, 0.4);fill: var(--primary-text)"></Icon>
            </div>
            <div v-else style="width: 45px;height: 45px;" class="flex justify-center items-center">
              <a-avatar :size="40" shape="square" :src="item.icon"></a-avatar>
            </div>
          </div>
        </a-tooltip>

      </div>

      <a-tooltip :title="showScreen ? '运行中的分屏' : '运行中的应用'">
        <div :style="{marginTop:simple?'0':'-16px'}" @click="appChange" v-if="isMain" style="flex-shrink:0;border-left: 1px solid var(--divider);width: 72px;"
          class="flex justify-center items-center  h-2/3 pointer ">
          <template v-if="!showScreen">
            <Icon icon="fuzhi" style="width: 40px;height: 40px;margin-left: 5px;margin-bottom: 3px"></Icon>
            <span
              style="position: absolute;width: 48px;height: 48px;text-align: center;line-height: 48px;font-weight: bold;font-size: 18px">{{
                runningApps.length + runningTableApps.length }}</span>
          </template>
          <template v-else>
            <Icon icon="touping" style="width: 40px;height: 40px;margin-left: 2px;"></Icon>
            <span
              style="position: absolute;width: 48px;height: 48px;text-align: center;line-height: 48px;font-weight: bold;font-size: 18px;margin-bottom: 6px">{{
                runningScreen }}</span>
          </template>

        </div>
      </a-tooltip>



    </div>
    <template v-if="!simple && isMain">
      <a-badge-ribbon v-if="!team.status" text="新功能" style="right:2px;top:-8px;opacity: 0.8;">
        <div @click="toggleTeam" class="common-panel s-bg pointer "
          style="margin-left: 0;padding:0.4em !important;min-width: 6em;margin-top: 0; ">
          <a-avatar src="/faces/smiling_face_with_smiling_eyes_3d.png">

          </a-avatar>
          <div class="mb-0 mt-0" > 小队
            <div v-if="true" style="display: inline-block;position: relative">
            </div>
          </div>
        </div>
      </a-badge-ribbon>
      <div v-else @click="toggleTeam" class="common-panel s-bg pointer "
        style="margin-left: 0;padding:0.6em !important;min-width: 6em;margin-top: 0;color:var(--primary-text);background: var(--primary-bg);">
        <a-avatar src="/faces/smiling_face_with_smiling_eyes_3d.png">

        </a-avatar>
        <div class="mb-0 mt-0"> 小队
          <div v-if="true" style="display: inline-block;position: relative;">
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
    <a-button @click="visibleTrans = false" style="position:fixed;left: 10px;top: 10px">取消</a-button>
    <iframe id="transFrame" style="width:100vw;height: 100vh;border: none">

    </iframe>
  </div>
  <a-drawer
    :contentWrapperStyle="{backgroundColor:'#212121',height:'216px'}"
    class="drawer"
    :closable="true"
    placement="bottom"
    :visible="menuVisible"
    @close="onClose"
  >
    <a-row>
      <a-col>
        <div @click="editNavigation" class="btn relative">
          <Icon style="font-size: 3em" icon="tianjia1"></Icon>
          <div><span>编辑导航</span></div>
        </div>
        <div @click="clickNavigation(item)" class="btn" v-for="item in builtInFeatures" :key="item.name">
          <Icon style="font-size: 3em" :icon="item.icon"></Icon>
          <div><span>{{ item.name }}</span></div>
        </div>
      </a-col>
    </a-row>
  </a-drawer>
  <!-- <a-drawer :contentWrapperStyle="{ backgroundColor: '#1F1F1F', height: '11em' }" :width="120" :height="120"
    class="drawer" :closable="false" placement="bottom" :visible="menuVisible" @close="onClose">
    <a-row style="margin-top: 1em" :gutter="[20, 20]">
      <a-col>
        <div @click="editNavigation" class="btn relative">
          <Icon style="font-size: 3em" icon="tianjia1"></Icon>
          <div><span>编辑</span></div>
         <GradeSmallTip powerType="bottomNavigation" @closeDrawer="closeDrawer"></GradeSmallTip>
        </div>
      </a-col>
    </a-row>
  </a-drawer> -->

  <transition name="fade">
    <div class="home-blur fixed inset-0" style="z-index: 999" v-if="quick">
      <EditNavigation @setQuick="setQuick"></EditNavigation>
    </div>
  </transition>

  <div class="home-blur fixed inset-0" style="z-index: 999;background: var(--mask-background-color);" v-if="changeFlag" @click="closeChangeApp">

    <ChangeApp :tab="tab" @closeChangeApp="closeChangeApp" :full="full" @setFull="setFull"></ChangeApp>
  </div>
  <TeamTip :key="teamKey" v-model:visible="showTeamTip"></TeamTip>
</template>

<script>
import PanelButton from './PanelButton.vue'
import { appStore } from '../store'
import { cardStore } from '../store/card'
import { navStore } from '../store/nav'
import { mapWritableState, mapActions } from 'pinia'
import Template from '../../user/pages/Template.vue'
import { ThunderboltFilled } from '@ant-design/icons-vue'
import { Modal } from 'ant-design-vue'
import SidePanel from './SidePanel.vue'
import SecondPanel from './SecondPanel.vue'
import GradeSmallTip from './GradeSmallTip.vue'
import { isMain } from '../js/common/screenUtils'

const { messageModel } = window.$models
import EditNavigation from './bottomPanel/EditNavigation.vue'
import ChangeApp from './bottomPanel/ChangeApp.vue'
import ScrolX from './ScrolX.vue'

import TeamTip from './TeamTip.vue'
import { teamStore } from '../store/team'
import { messageStore } from '../store/message'
import { appsStore } from '../store/apps'
import { screenStore } from '../store/screen'
import { toggleFullScreen } from '../js/common/common'
import MyAvatar from './small/MyAvatar.vue'

export default {
  name: 'BottomPanel',
  components: {
    MyAvatar,
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
  data() {
    return {
      tab: 'screen',

      lastTime: 0,
      visibleTrans: false,
      full: false,
      //显示小组提示
      showTeamTip: false,
      teamKey: Date.now(),
      updateMessageTimer: null,

      timer: null,

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
      timerRunning: false,
      showScreen: false
      //screenWidth: document.body.clientWidth
    }
  },
  unmounted() {

    let that = this
    window.removeEventListener('resize', that.checkScroll)
    clearInterval(this.updateMessageTimer)
    if (this.timerRunning) {
      clearInterval(this.timerRunning)
    }
  },
  mounted() {
    this.timerRunning = setInterval(() => {
      this.showScreen = !this.showScreen
    }, 5000)
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
    this.updateMessageTimer = setInterval(() => {
      this.getMessageIndex().then()
    }, 180000)
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
      // console.log('wheel',event)
      content.scrollLeft += event.deltaY
    })


  },
  computed: {
    ...mapWritableState(appStore, ['userInfo', 'settings', 'lvInfo', 'simple']),
    ...mapWritableState(appsStore, ['runningApps', 'runningTableApps']),
    ...mapWritableState(teamStore, ['team', 'teamVisible']),
    ...mapWritableState(screenStore, ['screens']),
    ...mapWritableState(cardStore, ['routeParams']),
    ...mapWritableState(navStore, ['footNavigationList','builtInFeatures','navigationToggle']),
    // ...mapWritableState(cardStore, ['navigationList', 'routeParams']),

    isMain() {
      return isMain()
    },
    runningScreen() {
      let count = 0
      this.screens.forEach(s => {
        if (s.running) {
          count++
        }
      })
      return count
    }
  },
  watch: {
    footNavigationList: {
      handler() {
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
    ...mapActions(messageStore, ['getMessageIndex']),
    async toggleTeam() {
      await this.updateMy(0)
      if (this.team.status === false) {
        this.teamKey = Date.now()
        this.showTeamTip = true
      } else {
        this.teamVisible = !this.teamVisible
      }

    },
    closeDrawer() {
      this.menuVisible = false
    },
    checkScroll() {
      this.$nextTick(() => {
        if (this.$refs.content.offsetHeight - this.$refs.content.clientHeight > 0) {
          this.$refs.content.style.marginTop = '17px'
        } else {
          this.$refs.content.style.marginTop = '0px'
        }
      })
    },
    goMy() {
      this.$router.push({ name: 'socialMy' })
    },
    ...mapActions(appStore, ['setUser']),
    setFull(value) {
      this.full = value
    },
    appChange() {
      if (this.showScreen) {
        this.tab = 'screen'
        this.routeParams.url && ipc.send('hideTableApp', { app: JSON.parse(JSON.stringify(this.routeParams)) })
      } else {
        this.tab = 'apps'
        this.routeParams.url && ipc.send('hideTableApp', { app: JSON.parse(JSON.stringify(this.routeParams)) })
      }
      this.changeFlag = true
    },
    closeChangeApp() {
      this.routeParams.url && setTimeout(() => { this.$router.push({ name: 'app', params: this.routeParams }) }, 400)
      this.changeFlag = false
    },
    showMenu() {
      this.routeParams.url && ipc.send('hideTableApp', { app: JSON.parse(JSON.stringify(this.routeParams)) })
      this.menuVisible = true
    },
    hideMenu(){
      this.menuVisible=false
    },
    onClose() {
      this.routeParams.url && this.$router.push({ name: 'app', params: this.routeParams })
      this.menuVisible = false
    },
    editNavigation() {
      this.quick = true
      this.menuVisible = false
    },
    setQuick() {
      this.quick = false
    },




    openSetting() {
      this.$router.push({ name: 'setting' })
      this.hideMenu()
    },
    openStatus() {
      this.hideMenu()
      if (this.$route.path === '/status') {
        this.$router.go(-1)
      } else {
        this.$router.push({ path: '/status' })
      }
    },

    power() {
      this.$router.push({ path: '/power' })
    },
    lock() {
      this.$router.push({ path: '/lock' })
    },
    transFile() {
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
    async setFullScreen() {
      // await tsbApi.window.isFullScreen()
      if (this.full) {
        this.full = false
        tsbApi.window.setFullScreen(false)
      } else {
        this.full = true
        tsbApi.window.setFullScreen(true)
      }

    },

    clickNavigation(item) {
      this.hideMenu()
      switch (item.type) {
        case 'systemApp':
          if (item.event === 'fullscreen') {
            toggleFullScreen()
            this.full = !this.full;
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
<style></style>
<style lang="scss" scoped>
.bottom-panel {
  :deep(.icon) {
    fill: var(--primary-text);
  }
}

.common-panel {
  margin-bottom: 0;
}

.btn {
  text-align: center;
  margin-right: 24px;
  background: #2A2A2A;
  border-radius: 12px;
  width: 100px;
  height: 100px;
  padding-top: 16px;
  line-height: 30px;
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


.scroll-content {
  :last-child {
    margin-right: 0;
  }
}
</style>
