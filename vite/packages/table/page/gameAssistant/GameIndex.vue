<template>
  <desk-group :settings="deskSettings" @changeDesk="changeDesk" ref="deskGroupRef" @showMore="showMore" :desk-list="deskList" v-model:current-desk-id="currentDeskId">
    <template #empty>
      <div v-if="currentDeskId!=='0' && currentDesk.iconUrl" class="game-bg p-5 rounded-md" style="margin: auto;width: 400px;margin-top: 40px">
        <p>
          <a-image class="rounded-md" :preview="false" :src="getCover(currentDeskId)"></a-image>
          <div class="mt-3 mb-3 text-lg font-bold">{{ getGame(currentDeskId).chineseName }}-{{ currentDeskId }}</div>
          此游戏还没有创建桌面，当您为游戏单独创建桌面后，游戏运行中，会自动为您切换至此桌面。
          点击下方按钮为此游戏创建独立桌面。
        </p>
        <a-row :gutter="15">
          <a-col :span="12">
            <a-button block size="large" @click="addCard()" type="primary ">添加第一个卡片</a-button>
          </a-col>
          <a-col :span="12">
            <a-button block size="large" @click="createMainDesk()">基于主桌面创建</a-button>
          </a-col>
        </a-row>
      </div>
      <div v-if="currentDeskId==='0'" class="game-bg p-5 rounded-md" style="margin: auto;width: 400px;margin-top: 40px">
        <div class="mb-3">
          <div class="text-center">
            <Emoji icon="game" style="width: 100px;height: 100px"></Emoji>
          </div>

          <div class="mt-3 mb-3 text-center font-bold" style="font-size: 18px">游戏助手主桌面</div>
          目前还未创建主桌面。<br>当您运行游戏后，系统会自动切换到游戏桌面。<br>如果此游戏不存在关联桌面，就会切换到主桌面。
          点击下方按钮独立桌面。
        </div>
        <a-row :gutter="15">
          <a-col :span="24">
            <a-button block size="large" @click="addCard()" type="primary ">添加第一个卡片</a-button>
          </a-col>
        </a-row>
      </div>
    </template>
    <template #toolsBefore>
      <a-tooltip title="添加游戏桌面" placement="bottom">
        <div @click="showMore"
             class=" btn-bg no-drag pointer h-10 w-10 rounded-md flex justify-center items-center ml-3">
          <icon class="icon" style="font-size: 22px" icon="tianjia1"></icon>
        </div>
      </a-tooltip>
    </template>
  </desk-group>


  <!--  <div v-if="false">-->
  <!--    <div v-if="!fullScreen" class="  px-5 pt-3.5" style="display: flex">-->
  <!--      <div class="game-tabs flex flex-row mb-3">-->
  <!--        <div @click="setSelectDeskId('0')" :class="{'tab-active':selectDeskId==='0'}"-->
  <!--             class="pr-3 home game-tab game-bg">-->
  <!--          <icon class="icon" style="font-size: 22px;" icon="desktop"></icon>-->
  <!--          主桌面-->
  <!--        </div>-->
  <!--        <div :class="{'tab-active':selectDeskId===item.appid}" @click="setSelectDeskId(item.appid)"-->
  <!--             style="width: 140px;" class="truncate pr-3 game-tab game-bg"-->
  <!--             v-for="(item,index) in recentGameList.slice(0,3)">-->
  <!--          <a-avatar class="mr-1 icon" :size="22" :src="getClientIcon(item.appid,item.clientIcon)"></a-avatar>-->
  <!--          <span class="">{{ item.chineseName }}</span>-->
  <!--          <div v-if="runningGame.appid===item.appid" style="border-bottom: 3px solid #ffffff"></div>-->
  <!--        </div>-->
  <!--        <div @click="showMore" v-if="recentGameList.length>3" class="game-tab game-bg more">-->
  <!--          <icon class="icon" style="font-size: 22px" icon="gengduo1"></icon>-->
  <!--          更多-->
  <!--        </div>-->
  <!--      </div>-->

  <!--      &lt;!&ndash;    <a-select&ndash;&gt;-->
  <!--      &lt;!&ndash;      placeholder="-"&ndash;&gt;-->
  <!--      &lt;!&ndash;      style="border: 1px solid rgba(255, 255, 255, 0.1);" v-model:value="selectDeskId"&ndash;&gt;-->
  <!--      &lt;!&ndash;      class="w-60 h-12 rounded-lg mr-3 text-xs s-bg right-nav" size="large" :bordered="false">&ndash;&gt;-->
  <!--      &lt;!&ndash;      <a-select-option v-for="item in recentGameList" :value="item.appid">{{ item.chineseName }}</a-select-option>&ndash;&gt;-->
  <!--      &lt;!&ndash;    </a-select>&ndash;&gt;-->
  <!--      <div>-->
  <!--        <div @click="setFullScreen"-->
  <!--             class="game-bg no-drag pointer h-10 w-10 rounded-md flex justify-center items-center ml-3">-->
  <!--          <Icon style="font-size: 18px" icon="fullscreen"></Icon>-->
  <!--        </div>-->
  <!--      </div>-->
  <!--    </div>-->
  <!--    <div v-if="fullScreen" class="no-drag">-->
  <!--      <div style="position: absolute;right: 10px;top: 10px;z-index: 999">-->
  <!--        <div @click="setFullScreen(false)"-->
  <!--             class="game-bg no-drag pointer h-10 w-10 rounded-md flex justify-center items-center ml-3">-->
  <!--          <Icon style="font-size: 18px" icon="quxiaoquanping_huaban"></Icon>-->
  <!--        </div>-->
  <!--      </div>-->
  <!--    </div>-->
  <!--    &lt;!&ndash; 卡片桌面  &ndash;&gt;-->
  <!--    <div class="rounded-xl mx-5" style="width: 100%;height: 0;flex: 1">-->
  <!--      <template v-if="(desks[selectDeskGame.appid] || selectDeskId==='0') && desks[selectDeskGame.appid] ">-->
  <!--        <Desk ref="currentDeskRef" :currentDesk="desks[selectDeskGame.appid]"-->
  <!--              :settings="desks[selectDeskGame.appid].settings"></Desk>-->
  <!--      </template>-->
  <!--      <div v-else>-->
  <!--        <div class="game-bg p-5 rounded-md" style="margin: auto;width: 400px;margin-top: 40px">-->
  <!--          <p>-->
  <!--            <a-image class="rounded-md" :preview="false" :src="getCover(selectDeskGame.appid)"></a-image>-->
  <!--            <div class="mt-3 mb-3 text-lg font-bold">{{ selectDeskGame.chineseName }}-{{ selectDeskGame.appid }}</div>-->
  <!--            此游戏还没有创建桌面，当您为游戏单独创建桌面后，游戏运行中，会自动为您切换至此桌面。-->
  <!--            点击下方按钮为此游戏创建独立桌面。-->
  <!--          </p>-->
  <!--          <a-row :gutter="15">-->
  <!--            <a-col :span="12">-->
  <!--              <a-button block size="large" @click="createDesk()" type="primary ">创建空白桌面</a-button>-->
  <!--            </a-col>-->
  <!--            <a-col :span="12">-->
  <!--              <a-button block size="large" @click="createMainDesk()">基于主桌面创建</a-button>-->
  <!--            </a-col>-->
  <!--          </a-row>-->
  <!--        </div>-->

  <!--      </div>-->
  <!--    </div>-->

  <!--  </div>-->
  <GameListDrawer :activeId="currentDeskId" :items="displayGameList" @visibleChanged=""
                  @valueChanged="(event)=>{this.currentDeskId=event.appid}"
                  v-model:visible="recentVisible"></GameListDrawer>

</template>

<script>
import { steamUserStore } from '../../store/steamUser'
import Desk from '../../components/desk/Desk.vue'
import { mapWritableState } from 'pinia'
import { getClientIcon, getCover } from '../../js/common/game'
import { nanoid } from 'nanoid'
import GameListDrawer from '../../components/game/GameListDrawer.vue'
import { appStore } from '../../store'
import { useToast } from 'vue-toastification'
import DeskGroup from '../../components/desk/DeskGroup.vue'
import Template from '../../../user/pages/Template.vue'
import Emoji from '../../components/comp/Emoji.vue'

const toast = useToast()
export default {
  components: { Emoji, Template, DeskGroup, GameListDrawer, Desk },
  computed: {
    ...mapWritableState(steamUserStore, ['deskSettings','desks', 'runningGame', 'recentGameList', 'deskList', 'currentDeskId', 'desksOld']),
    ...mapWritableState(appStore, ['fullScreen']),
    selectDeskGame () {
      let found = this.recentGameList.find(g => {
        return g.appid === this.selectDeskId
      })
      if (found) {
        return found
      } else {
        return {
          appid: '0',
          name: '主桌面',
        }
      }
    },
    displayGameList () {
      return this.recentGameList.filter(game => {
        let found = this.deskList.find(desk => {
          return desk.id === game.appid
        })

        console.log(found, '找到的')
        if (found) {
          if (found.cards.length > 0) {
            return false
          }
        }
        return true
      })
    }
  },
  data () {
    return {
      recentVisible: false,
      selectDeskId: '0',
      currentDesk: {
        cards: [],
        settings: {
          cardZoom: 100,
          marginTop: 0,
          cardMargin: 5//卡片间隙
        }
      }
    }
  },
  mounted () {
    this.migrateOldData()
    this.deskList.forEach(desk=>{
      //修正一下锁定机制，锁定的桌面无法被删除
      if(desk.iconUrl || desk.id==='0'){
        desk.lock=true
      }
    })
    let mainDesk = this.deskList.find(desk => {
      return desk.id === '0'
    })
    if (!mainDesk) {
      //如果还没有桌面
      this.deskList.push({
        id: '0',
        name: '主桌面',
        nanoid: nanoid(4),
        cards: [],
        lock:true,//锁定桌面，无法删除
        pin: true,
        icon: 'desktop',
        settings: {
          cardZoom: 100,
          marginTop: 0,
          cardMargin: 5//卡片间隙
        }
      })
    }
    if (this.deskList.length > 0) {
      const appid = this.$route.params['appid']
      if (appid) {
        let foundDesk = this.deskList.find(d => {
          return d.id === appid
        })
        if (!foundDesk) {

          toast('当前游戏还没有独立桌面，默认使用主桌面。')
        } else {
          setTimeout(() => {
            this.currentDeskId = appid
          }, 500)
        }
      }
    } else {

      this.currentDeskId = '0'
    }

  },
  methods: {
    getClientIcon,
    getCover,
    setSelectDeskId (id) {
      this.selectDeskId = id
    },
    migrateOldData () {
      if (typeof this.desks === 'object') {
        console.log(this.desks, '需要转移')
        if (Object.keys(this.desks).length === 0) {
          return
        }
        //如果是老版本数据未做迁移
        let deskList = Object.keys(this.desks).map(key => {
          let game = this.recentGameList.find(g => {
            return g.appid === key
          })
          if (game) {
            return {
              id: key,
              ...this.desks[key],
              iconUrl: this.getClientIcon(key, game.clientIcon),
              name: game.chineseName
            }
          } else if (key === '0') {
            return {
              id: key,
              ...this.desks[key],
              icon: 'desktop',
              name: '主桌面',
              pin: true,
            }
          }
        })
        this.deskList = deskList
        this.recentGameList.forEach(g => {
          let foundDesk = this.deskList.find(d => {
            return d.id === g.appid
          })
          if (!foundDesk) {
            this.deskList.push({
              id: g.appid,
              name: g.chineseName,
              lock:true,
              cards: [],
              settings: {
                cardZoom: 100,
                marginTop: 0,
                cardMargin: 5//卡片间隙
              },
              iconUrl: this.getClientIcon(g.appid, g.clientIcon)
            })
          }
        })
        this.desksOld = {
          ...this.desks
        }
        this.desks = []
      }
    },
    changeDesk(p){
      let changeDesk=this.deskList.find(desk=>{
        return desk.id===p.id
      })

      if(changeDesk){
        this.currentDeskId=changeDesk.id
        this.currentDesk=changeDesk
      }
    },
    addCard () {
      let foundDesk=this.deskList.find(desk=>{
        return desk.id===this.currentDeskId
      })

      if(!foundDesk){
        const game=this.getGame(this.currentDeskId)
        this.deskList.unshift({
          id: game.appid,
          name: game.chineseName,
          cards: [],
          settings: {
            cardZoom: 100,
            marginTop: 0,
            cardMargin: 5//卡片间隙
          },
          iconUrl: this.getClientIcon(game.appid, game.clientIcon)
        })
      }

      this.$refs.deskGroupRef.addCard()
    },
    createMainDesk () {
      this.desks[this.selectDeskGame.appid] = {
        name: this.selectDeskGame.name,
        nanoid: nanoid(4),
        cards: this.desks['0'].cards,
        settings: this.desks['0'].settings
      }
    },
    showMore () {
      this.recentVisible = true
    },
    getGame (id) {
      return this.recentGameList.find(g => {
        return g.appid === id
      })

    }

  }
}
</script>

<style lang="scss" scoped>
.game-tabs {
  .game-tab {
    .icon {
      margin-top: -1px;
      vertical-align: text-top;
    }

    cursor: pointer;

    &.tab-active, &:hover {
      opacity: 1;
      font-weight: bold;
    }

    opacity: 0.5;
    line-height: 42px;
    font-size: 15px;
    min-width: 150px;
    border-radius: 4px;
    margin-right: 10px;
    text-align: left;
    padding-left: 10px;
    padding-right: 10px;
  }

  .more {
    min-width: 80px
  }

  .home {
    min-width: 90px;
  }
}

.game-bg {
  background: var(--primary-bg);
  color: var(--primary-text);
}

:deep(.ant-result-success) {
  background: var(--primary-bg);
  color: var(--primary-text);
}

:deep(.ant-result-title) {
  color: var(--primary-text);
}

:deep(.ant-result-subtitle) {
  color: var(--primary-text);
}

:deep(.ant-btn:nth-of-type(2)) {
  background: var(--primary-bg);
  color: var(--primary-text);
}
.btn-bg {
  background: var(--primary-bg);
  color: var(--primary-text);
  height: 42px;
  line-height: 42px;

  &:hover {
    opacity: 0.8;
  }
}

</style>
