<template>
  <ShareToChat :visible="shareVisible" @close="shareVisible=false" :content="shareContent" type="game"
               alias="游戏"></ShareToChat>
  <div v-if="fullScreen === false">
    <div class="pt-3.5">
      <div class="flex flex-row  items-center game-page-nav">
        <div class="flex flex-row" style="padding-left: 1em">
          <HorizontalPanel :navList="gameNavList" v-model:selectType="gameType"></HorizontalPanel>
          <HorizontalPanel :navList="sortList" class="ml-3 main-nav" v-model:selectType="sortType"></HorizontalPanel>
        </div>
        <div class="flex flex-row ml-3">
          <div @click="openDrawer"
               class="my-bg my-title pointer h-12 w-12 rounded-lg  flex justify-center items-center">
            <Icon style="font-size: 22px" icon="sousuo"></Icon>
          </div>
          <div @click="openModal"
               class="my-bg my-title pointer h-12 w-12 rounded-lg flex justify-center items-center ml-3">
            <Icon style="font-size: 22px" icon="tianjia2"></Icon>
          </div>
          <div @click="()=>{this.settingVisible = true}"
               class="my-bg my-title pointer h-12 w-12 rounded-lg flex justify-center items-center ml-3">
            <Icon style="font-size: 22px" icon="shezhi"></Icon>
          </div>
          <div @click="openScreen"
               class="my-bg my-title pointer h-12 w-12 rounded-lg flex justify-center items-center ml-3">
            <Icon style="font-size: 22px" icon="fullscreen"></Icon>
          </div>
        </div>

      </div>
      <vue-custom-scrollbar :settings="settingsScroller"
                            ref="gameScroll" style="height: calc(100vh - 15.8em);padding-right: 5px;padding-left: 1em"
                            class="pt-3 mr-3" @scroll="scrollList($event)">
        <div class="flex flex-row flex-wrap -ml-3 " v-if="gameType.name==='other'&& localGameList.length>0">
          <!--   导入的外部游戏，非steam   -->
          <div class="pb-3 pl-3 game-list-local flex-shrink-0 my-game-content" v-for="(item,index) in displayGameList">
            <div class="my-bg h-full pointer w-full rounded-lg" style="padding-top:30px" @click="openMyGame(item)"
                 @contextmenu="openOtherDetail(item)">
              <div class="relative    mx-auto " style="height: 65px;width: 65px;" :class="hoverIndex===index?'fly':''"
                   @mouseenter="mouseOn(index)" @mouseleave="mouseClose">
                <img :src="item.icon" class="w-full h-full rounded-lg object-cover" alt="">
              </div>
              <div class="w-full h-12  bottom-0  mt-4 text-center text-white truncate px-3">{{ item.name }}</div>
            </div>
          </div>
        </div>
        <div class="flex flex-row flex-wrap -ml-3 content-game "
             v-else-if="gameType.name==='steam'&&steamGameList.length>0">
          <!--  <div class=" pl-3 pb-3 game-list-item-first flex-shrink-0">-->
          <!--    <div class="relative rounded-lg  w-auto h-full " @contextmenu="openSteamDetail(steamGameList[0])">-->
          <!--      <img :src="'https://cdn.cloudflare.steamstatic.com/steam/apps/'+steamGameList[0].appinfo.appid+'/header.jpg'" class="w-full h-full rounded-lg object-cover"  alt="">-->
          <!--      <div class="game-item-title-bg first w-full h-1/4 absolute bottom-0 flex flex-row items-center pl-3"  >-->
          <!--        <div v-if="!gameRun" @click="runGame" class="pointer flex justify-center items-center" style="height: 80%;background: rgba(82, 196, 26, 1);aspect-ratio: 1/1;border-radius: 10px">-->
          <!--          <Icon style="height: 60%;width: 60%" icon="caret-right"></Icon>-->
          <!--        </div>-->
          <!--        <div v-else @click="runGame" class="pointer flex justify-center items-center" style="height: 80%;background: rgba(250, 173, 20, 1);aspect-ratio: 1/1;border-radius: 10px">-->
          <!--          <Icon style="height: 60%;width: 60%" icon="tuichu"></Icon>-->
          <!--        </div>-->
          <!--        <div class="flex flex-col ml-3">-->
          <!--          <span>{{steamGameList[0].appinfo.appid}}</span>-->
          <!--          <div class="text-xs" style="color: rgba(255, 255, 255, 0.6);">-->
          <!--            <span>过去两周：12小时</span>-->
          <!--            <span class="ml-1">总数：133小时</span>-->
          <!--          </div>-->
          <!--        </div>-->
          <!--       </div>-->
          <!--    </div>-->
          <!--  </div>-->
          <div class="pb-3 pl-3 game-list-item flex-shrink-0 my-game-content " v-for="(item,index) in displaySteamGameList">
            <div class="relative  w-auto h-full my-bg  pointer flex flex-col " style="border-radius: 12px"
                 :class="hoverIndex===index?'fly':''" @mouseenter="mouseOn(index)" @mouseleave="mouseClose"
                 @click="openSteamDetail(item)">
              <div :style="showTime?'height: calc(100% - 96px)':'height: calc(100% - 50px)'">
                <img v-if="item" style="border-radius: 12px 12px 0 0"
                     :src="'https://cdn.cloudflare.steamstatic.com/steam/apps/'+item.appid+'/header.jpg'"
                     class="w-full h-full  object-cover" alt="">
              </div>

              <!--    <div class="game-item-title-bg w-full h-12 absolute bottom-0 flex items-center pl-3" >{{item.appinfo.common.name}}</div>-->
              <div :style="showTime?'height: 96px':'height: 50px'" class="p-3 flex flex-col justify-between ">
                <span class="text-more text-white text-base my-item"
                      style="font-weight: 400">{{ item.chineseName }}</span>
                <span :style="showTime?'':'display:none'"
                      class="text-xs my-num">过去两周：{{ twoWeekTime(item.time) }}小时</span>
                <span :style="showTime?'':'display:none'"
                      class="text-xs my-num">总数：{{ totalTime(item.time) }}小时</span>
              </div>
            </div>

          </div>

        </div>
        <div v-else>
          <div class="text-center mt-20 item-content flex-col justify-center items-center">
            <a-empty image="/img/test/load-ail.png" description=""/>
            <xt-button type="theme" v-if="gameType.name==='steam'" @click="goBind"  :w="150">绑定Steam账号</xt-button>
            <xt-button v-else @click="openModal" type="theme" :w="150">导入外部游戏</xt-button>
          </div>

        </div>
      </vue-custom-scrollbar>
    </div>
    <Modal v-model:visible="modalVisibility" v-if="modalVisibility" animationName="b-t" :blurFlag="true">
      <div class="p-6 my-bg" @click.stop>
        <!--      <div class="flex flex-row items-center">-->
        <!--        <Icon style="height: 26px;width: 26px" icon="steam"></Icon>-->
        <!--        <div class="flex flex-col ml-4">-->
        <!--          <span class="text-white">导入Steam游戏库</span>-->
        <!--          <span>选择你本地的Steam本地库</span>-->
        <!--        </div>-->
        <!--      </div>-->
        <!--    <div class="flex flex-row mt-4 mb-4">-->
        <!--      <div class="s-item pointer h-12 w-48 rounded-lg flex justify-center items-center">选择游戏库</div>-->
        <!--      <div @click="openModal" class="s-item pointer h-12 w-12 rounded-lg flex justify-center items-center ml-3"><Icon style="" icon="yiwen-xianxing"></Icon></div>-->
        <!--    </div>-->
        <div class="flex flex-row items-center">
          <Icon style="height: 26px;width: 26px" icon="game"></Icon>
          <div class="flex flex-col ml-4">
            <span style="color:var(--primary-text)">自定义导入其他游戏</span>
            <span style="color: var(--secondary-text);">手动选择游戏运行文件</span>
          </div>
        </div>
        <div class="flex flex-row mt-4">
          <div style="background: var(--active-bg);color:var(--active-text);"
               class="pointer h-12 w-48 rounded-lg flex justify-center items-center" @click.stop="openLocal">选择游戏
          </div>
          <div @click="openModal" style="background: var(--secondary-bg);"
               class="my-title pointer h-12 w-12 rounded-lg flex justify-center items-center ml-3">
            <Icon style="" icon="yiwen-xianxing"></Icon>
          </div>
        </div>
      </div>
    </Modal>
    <Modal v-model:visible="steamShow" v-if="steamShow" animationName="bounce-in" :blurFlag="true">
      <div class=" flex flex-col" style="border-radius: 6px;overflow: hidden" v-if="currentSteamGame">
        <div class=" relative" style="height: 188px;width: 400px" v-if="currentSteamGame">
          <img :src="'https://cdn.cloudflare.steamstatic.com/steam/apps/'+currentSteamGame.appid+'/header.jpg'" style=" "
               class="w-full h-full object-cover" alt="">
        </div>
        <div class="  p-4">
          <div style="user-select: text" class="text-white">
            <a-avatar shape="square" :size="24"
                      :src="getClientIcon(this.currentSteamGame.appid,this.currentSteamGame.clientIcon)"></a-avatar>
            <span class="xt-text ml-2 truncate"> {{ currentSteamGame.chineseName }} {{ currentSteamGame.appid }}</span></div>
          <div class="flex flex-row flex-wrap w-80">
            <div class="w-1/2 mt-3">上次游玩：{{ getDateMyTime(currentSteamGame.time) }}</div>
            <!--            <div class="w-1/2 mt-3">游戏在线玩家数：{{ totalTime(currentSteamGame.online) || '-' }}人</div>-->
            <div class="w-1/2 mt-3">总时长：{{ totalTime(currentSteamGame.time) }}小时</div>
            <div class="w-1/2 mt-3">近两周：{{ twoWeekTime(currentSteamGame.time) }}小时</div>
            <div class="w-1/2 mt-3">M站评分：{{ currentSteamGame.metacritic_score || '无' }}</div>
          </div>
          <div class="flex flex-row justify-between mt-3 text-white">
            <div v-if="runningGame.appid!==currentSteamGame.appid"
                 class="pointer s-item game-start-button flex h-10 justify-center items-center rounded-sm w-52"
                 @click="playSteamGame(currentSteamGame)">
              <Icon style="font-size: 22px" class="mr-2" icon="bofang"></Icon>
              开始游戏
            </div>
            <div v-else
                 class="pointer s-item flex h-10 justify-center items-center game-start-button running rounded-lg w-64"
                 @click="stopGame(currentSteamGame)">
              <Icon style="font-size: 18px" class="mr-2" icon="guanbi"></Icon>
              停止
            </div>
            <!--                <div class="pointer s-item w-10  flex justify-center items-center rounded-lg ml-4" @click="openDetail"><Icon style=""  icon="folder-open"></Icon></div>-->
            <xt-button @click="shareSteamGame" :w="40" :h="40">
              <Icon style="" icon="fenxiang"></Icon>
            </xt-button>
            <xt-button @click="goDetail" :w="40" :h="40">
              <shop-outlined/>
            </xt-button>
            <!--                <div class="pointer s-item h-10 w-10 flex justify-center items-center rounded-lg ml-4" @click="deleteGame"><Icon style=""   icon="delete"></Icon></div>-->
            <Menu :menus="gameMenus">
              <xt-button :w="40" :h="40">
                <more-outlined/>
              </xt-button>
            </Menu>
          </div>
        </div>
      </div>
    </Modal>
    <Modal v-model:visible="otherShow" v-show="otherShow" animationName="bounce-in" :blurFlag="true">
      <!--   外部游戏详情弹窗     -->
      <div class="pt-12 pb-8 px-8">
        <div class="w-24 h-24 mx-auto">
          <img :src="currentLocalGame.icon" class="w-full h-full rounded-lg object-cover" alt="">
        </div>
        <div class=" w-full h-12  flex items-center justify-center mt-3">{{ currentLocalGame.name }}</div>
        <div class="flex flex-col  justify-between">
          <div class="flex flex-row  mt-3">
            <div @click="showMyGameDir" class="pointer s-item w-44 flex justify-center items-center rounded-lg mr-3">
              <Icon style="" class="mr-2" icon="folder-open"></Icon>
              安装路径
            </div>
            <div @click="deleteMyGame" class="pointer s-item w-10 h-10 flex justify-center items-center rounded-lg">
              <Icon icon="delete"></Icon>
            </div>
          </div>
          <div @click="openMyGame(currentLocalGame)"
               class="pointer s-item flex h-10 justify-center items-center rounded-lg mt-3">
            <Icon style="" class="mr-2" icon="game"></Icon>
            开始游戏
          </div>
        </div>
      </div>
    </Modal>
    <a-drawer :width="500" v-model:visible="drawerVisible" placement="right">
      <template #title>
        <div class="text-center">搜索</div>
      </template>
      <a-input
        v-model:value="selectName"
        class="rounded-lg mt-6 my-bg my-title"
        style="height: 48px"
        placeholder="搜索游戏"
      >
      </a-input>
    </a-drawer>
    <a-drawer :width="500" v-model:visible="settingVisible" placement="right">
      <template #title>
        <div class="text-center">设置</div>
      </template>
      <div class="hidden select-main-nav">
        <div>排序</div>
        <HorizontalPanel :navList="sortList" class="w-80 mt-3 " v-model:selectType="sortType"></HorizontalPanel>
      </div>
      <div class="line">
        <span class="mr-2">显示游戏时长</span>
        <a-switch v-model:checked="showTime"/>
      </div>
      <div class="line">
        <span class="mr-2">显示隐藏游戏</span>
        <a-switch v-model:checked="gameSettings.showHideGame"/>
      </div>
    </a-drawer>
  </div>
  <MyFullScreenGame v-else @close="fullScreen = false"></MyFullScreenGame>

</template>
<script>
import HorizontalPanel from '../../components/HorizontalPanel.vue'
import Modal from '../../components/Modal.vue'
import MyFullScreenGame from './MyFullScreenGame.vue'
import { mapWritableState, mapActions } from 'pinia'
import { appStore } from '../../store'
import { steamUserStore } from '../../store/steamUser'
import { getDateTime } from '../../util'
import { runExec } from '../../js/common/exec'
import { message, Modal as AntModal } from 'ant-design-vue'
import { getClientIcon, steamProtocol } from '../../js/common/game'
import JumpNotice from '../../components/game/JumpNotice.vue'
import { useToast } from 'vue-toastification'
import cache from '../../components/card/hooks/cache'
import Menu from '../../ui/components/Menu/index.vue'
import XtButton from '../../ui/libs/Button/index.vue'
import { MoreOutlined, ShopOutlined } from '@ant-design/icons-vue'
import ShareToChat from '../../ui/chat/ShareToChat.vue'

import { completeTask } from '../../apps/task/page/branch/task.ts'
import { isHide } from './game'

const toast = useToast()
export default {
  name: 'MyGame',
  components: {
    ShareToChat,
    XtButton,
    Menu,
    JumpNotice,
    HorizontalPanel,
    Modal,
    MyFullScreenGame,
    MoreOutlined,
    ShopOutlined
  },
  data () {
    return {
      shareVisible: false,//分享组件可见
      gameMenus: [
        {
          label: '隐藏游戏',
          callBack: () => {
            this.steamShow = false
            this.hideSteamGame(this.currentSteamGame.appid)
          }
        },
        {
          label: '定位到Steam游戏库',
          callBack: () => {
            console.log('定位到某个游戏')
            this.steamShow = false
            this.openDetail()
          }
        },
        {
          label: '删除',
          callBack: () => {
            this.deleteGame()
          }
        },

      ],
      drawerVisible: false,
      //跳转到对应的桌面的弹窗
      jumpVisible: false,
      settingVisible: false,
      settingsScroller: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true
      },
      selectName: '',
      gameNavList: [{ title: 'Steam游戏', name: 'steam' }, { title: '其他游戏', name: 'other' }],
      gameType: { title: 'Steam游戏', name: 'steam' },
      sortList: [{ title: '最近游玩', name: 'timer' }, { title: 'A-Z', name: 'letter' }],
      sortType: { title: '最近游玩', name: 'timer' },
      gameList: [],
      modalVisibility: false,
      gameRun: false,
      steamShow: false,
      otherShow: false,
      currentSteamGame: {
        src: '',
        lastTime: 0,
      },
      currentLocalGame: {},
      hoverIndex: -1,
      screenShow: false,
    }
  },
  mounted () {
    this.gameList = this.steamGameList
    if (this.steamGameList.length > 0) {
      if (this.steamGameList[0].appinfo) {
        this.setSteamGameList(this.steamGameList)
      }
    }
    this.updateGameTime()
  },
  computed: {
    ...mapWritableState(steamUserStore, ['steamGameList', 'localGameList', 'runningGame', 'showTime', 'deskList','hideGames']),
    ...mapWritableState(appStore, ['fullScreen']),
    ...mapWritableState(steamUserStore,{
      gameSettings:'settings'
    }),
    displayGameList () {
      return this.localGameList.filter(game => {
        return isHide('local',game.id)
      })
    },
    displaySteamGameList(){
      console.log(this.steamGameList)
      console.log(this.hideGames)
      return this.steamGameList.filter(game => {
        return !isHide('steam',game.appid)
      })
    },
    selectSteamList () {
      if (this.selectName.trim() !== '') {
        this.steamGameList.filter((i) => {
          if (i.appInfo) {
            return i.name.toLowerCase().includes(this.selectName.toLowerCase())
          } else {
            return false
          }
        })
      } else
        return this.steamGameList
    },
    shareContent () {
      return {
        description: 'steam游戏',
        data: JSON.stringify({
          type: 'game',
          game: {
            ...this.currentSteamGame,
            header: 'https://cdn.cloudflare.steamstatic.com/steam/apps/' + this.currentSteamGame.appid + '/header.jpg',
            icon: getClientIcon(this.currentSteamGame.appid, this.currentSteamGame.clientIcon),
          }
        })
      }
    }
  },
  methods: {
    getClientIcon,
    ...mapActions(steamUserStore, ['setGameList', 'playGame', 'getClient', 'updateGameTime']),
    goBind () {
      this.$router.push({ name: 'gameSetting' })
    },
    openMyGame (item) {
      require('electron').shell.openPath(item.path)
    },
    async openLocal () {
      let openPath = await tsbApi.dialog.showOpenDialog({
        title: '选择导入的代码',
        filters: [{ name: '全部', extensions: ['*'] }],
        properties: ['multiSelections'],
      })
      if (!openPath) {
        return
      }
      let dropFiles = await ipc.sendSync('getFilesIcon', {
        files: JSON.parse(JSON.stringify(openPath)),
      })
      this.modalVisibility = false
      dropFiles.forEach(game => {
        this.localGameList.unshift(game)
      })
    },
    stopGame () {
      steamProtocol._run('stopstreaming')
      this.runningGame = {}
    },
    /**
     * 开始steam游戏游玩
     */
    playSteamGame () {
      // 支线任务点
      completeTask('Z0102')
      this.playGame(this.currentSteamGame)
      console.log(toast)
      // toast(JumpNotice)
      this.deskList.forEach(desk => {
        if (desk.id === this.currentSteamGame.appid) {
          desk.order = Date.now()
        }
      })

      toast({
        component: JumpNotice,
        props: {
          game: this.currentSteamGame
        },
        listeners: {
          'jump': (event) => {
            console.log(event)
            this.$router.push({
              name: 'gameIndex',
              params: {
                appid: event.game.appid
              }
            })
          }
        }
      }, {
        icon: false,
        closeOnClick: false,
        closeButton: false,
        pauseOnFocusLoss: false,
        pauseOnHover: false
      })
    },
    deleteGame () {
      steamProtocol.uninstall(this.currentSteamGame.appid)
    },
    hideSteamGame (appid) {
      let foundIndex=this.hideGames.findIndex(game=>{
        return (game.type==='steam' && game.id===appid)
      })
      if(foundIndex>-1){
        return
      }else{
        this.hideGames.push({
          id:appid,
          type:'steam'
        })
      }
      console.log('隐藏了',this.hideGames)
    },
    showMyGameDir () {
      require('electron').shell.showItemInFolder(this.currentLocalGame.path)
    },
    deleteMyGame () {
      AntModal.confirm({
        centered: true,
        content: '是否确认删除游戏？此操作不可还原。',
        onOk: () => {
          this.otherShow = false
          let foundIndex = this.localGameList.findIndex(li => {
            return li === this.currentLocalGame
          })
          this.localGameList.splice(foundIndex, 1)
        }
      })

    },
    shareSteamGame () {
      this.steamShow = false
      this.shareVisible = true
    },
    goDetail () {
      console.log(this.currentSteamGame)
      this.$router.push({
        name: 'GameDiscountDetail',
        params: {
          id: this.currentSteamGame.appid
        }
      })
    },
    openDetail () {
      message.info('正在为定位到Steam游戏库')
      runExec('start steam://nav/games/details/' + this.currentSteamGame.appid)
    },
    getDateMyTime (time) {
      if (time) {
        const timer = getDateTime(new Date(parseInt(time.rtime_last_played) * 1000))
        return time.rtime_last_played !== 0 ? timer.year + '-' + timer.month + '-' + timer.day : '0'
      } else {
        return 0
      }

    },
    twoWeekTime (time) {
      return time ? (time.playtime_2weeks / 60).toFixed(1) : 0
    },
    totalTime (time) {
      return time ? (time.playtime_forever / 60).toFixed(1) : 0
    },
    scrollList (e) {
      if (e.target.scrollTop < 13) {
        this.$refs.gameScroll.$el.style.marginTop = e.target.scrollTop + 'px'
      } else {
        this.$refs.gameScroll.$el.style.marginTop = '13px'
      }
    },
    mouseOn (e) {
      this.hoverIndex = e
    },
    mouseClose () {
      this.hoverIndex = -1
    },
    openModal () {
      this.modalVisibility = true
    },
    openDrawer () {
      this.drawerVisible = true
    },
    runGame () {
      this.gameRun = !this.gameRun
    },

    openSteamDetail (item) {
      this.currentSteamGame = item
      this.steamShow = true
      // this.getClient().getPlayerCount(this.currentSteamGame.appid, (err, online) => {
      //   if (err) {
      //     console.error(err)
      //   }
      //   this.currentSteamGame.online = online
      // })
    },
    openOtherDetail (item) {
      console.log(item)
      this.currentLocalGame = item
      this.otherShow = true
    },
    openScreen () {
      this.fullScreen = true
      // document.querySelector('.content-view').style = 'margin:0;padding:0;'
    },
    closeScreen () {
      this.fullScreen = false
    },
  },
  watch: {
    'sortType': {
      handler () {
        if (this.sortType.name === 'letter') {
          this.selectSteamList.sort((a, b) => a.name.localeCompare(b.name))
        } else {
          this.selectSteamList.sort((a, b) => {
            if (a.time === undefined && a.time === undefined) {
              return 0
            } else if (a.time === undefined) {
              return 1
            } else if (b.time === undefined) {
              return -1
            } else if (a.time !== b.time) {
              return b.time.rtime_last_played - a.time.rtime_last_played
            }
          })
        }
      },
      immediate: true
    },
    'showTime': {
      handler (newVal) {
        cache.set('game_duration', newVal)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.my-bg {
  background: var(--primary-bg);
}

.my-title {
  color: var(--primary-text);
}

.my-item {
  font-size: 16px;
  color: var(--primary-text);
  font-weight: 600;
}

.my-num {
  font-size: 13px;
  color: var(--secondary-text);
  font-weight: 400;
}

.my-game-content {
  transform-style: preserve-3d;
  perspective: 1000px;
}

.fly {
  animation: fly .5s;
  animation-fill-mode: forwards;
  transform-origin: 50% 0 10px;
}

@keyframes fly {
  0% {

  }
  100% {
    transform: rotateX(5deg) translateZ(20px);
  }
}

@media screen and (max-width: 1064px) {
  .main-nav {
    display: none;
  }
  .select-main-nav {
    display: block;
  }
}

.game-list-item {
  max-width: 300px;
}

.game-list-local {
  max-width: 300px;
  max-height: 170px;
  aspect-ratio: 231/300;
}

@media screen and (max-width: 840px) {
  .game-list-item {
    width: calc(100% / 2);
  }
  .game-list-local {
    width: calc(100% / 3);
  }
}

@media screen and (min-width: 840px) and (max-width: 1140px) {
  .game-list-item {
    width: calc(100% / 3);
  }
  .game-list-local {
    width: calc(100% / 4);
  }
}

@media screen and (min-width: 1140px) and (max-width: 1440px) {
  .game-list-item {
    width: calc(100% / 4);
  }
  .game-list-local {
    width: calc(100% / 5);
  }
}

@media screen and (min-width: 1440px) and (max-width: 1740px) {
  .game-list-item {
    width: calc(100% / 5);
  }
  .game-list-local {
    width: calc(100% / 6);
  }
}

@media screen and (min-width: 1740px) and (max-width: 2040px) {
  .game-list-item {
    width: calc(100% / 6);
  }
  .game-list-local {
    width: calc(100% / 7);
  }
}

@media screen and (min-width: 2040px) and (max-width: 2340px) {
  .game-list-item {
    width: calc(100% / 7);
  }
  .game-list-local {
    width: calc(100% / 8);
  }
}

@media screen and (min-width: 2340px) and (max-width: 2640px) {
  .game-list-item {
    width: calc(100% / 8);
  }
  .game-list-local {
    width: calc(100% / 9);
  }
}

@media screen and (min-width: 2640px) and (max-width: 2940px) {
  .game-list-item {
    width: calc(100% / 9);
  }
}

@media screen and (min-width: 2940px) and (max-width: 3240px) {
  .game-list-item {
    width: calc(100% / 10);
  }
}

@media screen and (min-width: 3240px) and (max-width: 3540px) {
  .game-list-item {
    width: calc(100% / 11);
  }
}

@media screen and (min-width: 3540px) and (max-width: 3840px) {
  .game-list-item {
    width: calc(100% / 12);
  }
}
</style>
