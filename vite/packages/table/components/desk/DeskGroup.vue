<template>
  <!--  工具栏-->
  <div class="mb-2 flex flex-row" v-if="showTopBar && !fullScreen">
    <!-- tabs   -->
    <div class="tabs flex flex-row mb-3 ml-3" v-if="showTabs">
      <!--      <div @click="setCurrentDeskId('0')" :class="{'tab-active':currentDeskId==='0'}" class="pr-3 home game-tab game-bg">-->
      <!--        <icon class="icon" style="font-size: 22px;" icon="desktop"></icon>-->
      <!--        主桌面-->
      <!--      </div>-->
      <div :class="{'tab-active':currentDeskId===item.id}" @click="setCurrentDeskId(item.id)" style="width: 140px;"
           class="truncate pr-3 tab tab-bg" v-for="(item,index) in displayDesks">
        <a-avatar v-if="item.iconUrl" shape="square" class="mr-2 icon " :size="22" :src="item.iconUrl"></a-avatar>
        <icon v-else :icon="item.icon" style="font-size: 18px;vertical-align: middle" class="mr-2"></icon>
        <span class="">{{ item.name }}</span>
        <div v-if="currentDeskId===item.id" style="border-bottom: 3px solid var(--active-bg)"></div>
      </div>
      <a-tooltip title="全部桌面" placement="bottom">
        <div @click="showAll"
             class="  btn-bg no-drag pointer h-10 w-10 rounded-md flex justify-center items-center ml-3">
          <icon class="icon" style="font-size: 22px" icon="gengduo1"></icon>
        </div>
      </a-tooltip>

    </div>

    <div v-if="showTools">

      <div class="flex flex-row">
        <a-tooltip title="添加游戏桌面" placement="bottom">
          <div @click="showMore"
               class=" btn-bg no-drag pointer h-10 w-10 rounded-md flex justify-center items-center ml-3">
            <icon class="icon" style="font-size: 22px" icon="tianjia1"></icon>
          </div>
        </a-tooltip>
        <a-tooltip v-if="!editing" title="开始调整桌面" placement="bottom">
          <div @click="startEdit"
               class=" btn-bg no-drag pointer h-10 w-10 rounded-md flex justify-center items-center ml-3">
            <icon class="icon" style="font-size: 22px" icon="line-dragdroptuofang"></icon>
          </div>
        </a-tooltip>
        <a-tooltip v-else title="停止调整桌面" placement="bottom">
          <div @click="stopEdit"
               class=" btn-bg no-drag pointer h-10 w-10 rounded-md flex justify-center items-center ml-3">
            <icon class="icon" style="font-size: 22px;color:red" icon="tingzhi"></icon>
          </div>
        </a-tooltip>
        <a-tooltip title="全屏" placement="bottom">
          <div @click="setFullScreen"
               class="btn-bg no-drag pointer h-10 w-10 rounded-md flex justify-center items-center ml-3">
            <Icon style="font-size: 18px" icon="fullscreen"></Icon>
          </div>
        </a-tooltip>
      </div>
    </div>
  </div>
  <div v-if="fullScreen" class="no-drag">
    <div style="position: absolute;right: 10px;top: 10px;z-index: 999">
      <div @click="setFullScreen(false)"
           class="btn-bg no-drag pointer  w-10 rounded-md flex justify-center items-center ml-3">
        <Icon style="font-size: 18px" icon="quxiaoquanping_huaban"></Icon>
      </div>
    </div>
  </div>
  <template v-if="currentDesk && currentDesk?.cards?.length>0 ">
    <Desk :editing="editing" ref="currentDeskRef" :currentDesk="currentDesk"
          :settings="currentDesk.settings" :key="key"></Desk>
  </template>
  <template v-else>
    <slot name="empty">

    </slot>
    <span v-show="false">
       <Desk ref="currentDeskRef" :currentDesk="currentDesk"  :key="key"></Desk>
    </span>

  </template>
  <a-drawer height="220" placement="bottom" v-model:visible="allDeskListVisible">
    <AllDeskList :activeId="currentDeskId" :items="deskList" @visibleChanged=""
                 @valueChanged="(event)=>{setCurrentDeskId(event.id);this.allDeskListVisible=false}"
    ></AllDeskList>
  </a-drawer>

</template>


<script lang="ts">
import Desk from "./Desk.vue";
import {appStore} from "../../store";
import {mapWritableState, mapWritableState} from "pinia";
import GameListDrawer from "../game/GameListDrawer.vue";
import AllDeskList from "./AllDeskList.vue";

export default {
  name: "DeskGroup",
  components: {AllDeskList, GameListDrawer, Desk},
  emits: ['update:currentDeskId', 'showMore'],
  props: {
    deskList: {
      type: Array,
      default: []
    },
    //是否显示tabs
    showTabs: {
      type: Boolean,
      default: true
    },

    //是否显示顶部栏
    showTopBar: {
      type: Boolean,
      default: true
    },
    //是否显示工具栏
    showTools: {
      type: Boolean,
      default: true
    },
    currentDeskId: {
      type: String,
      default: '0'
    }
  },
  data() {
    return {
      key:Date.now(),
      moreDesksVisible: false,//显示更多桌面
      allDeskListVisible: false,
      editing: false//编辑桌面
    }
  },
  mounted() {
    if (this.deskList.length > 0) {
      this.currentDesk = this.deskList[0]
    }
  },
  computed: {
    ...mapWritableState(appStore, ['fullScreen']),
    currentDesk() {
      return this.deskList.find(desk => {
        return desk.id === this.currentDeskId
      })
    },
    displayDesks() {
      return [...this.deskList.filter(desk => {
        return desk.pin
      }),
        ...this.deskList.filter(desk => {
          return !desk.pin
        })
      ].slice(0, 4).sort((a, b) => {
        if (b.pin) {
          //置顶的桌面排最前面
          return 9999999999999
        }
        return Number(b.order || 0) - Number(a.order || 0)
      })
    }
  },
  methods: {
    startEdit() {
      this.key=Date.now()
      this.editing = true
      this.$refs.currentDeskRef.update()
    },
    stopEdit() {
      this.key=Date.now()
      this.editing = false
    },
    addCard() {
      this.$refs.currentDeskRef.newAddCard()
    },
    setFullScreen(flag = true) {
      this.$refs.currentDeskRef.stashLayout()
      this.fullScreen = flag
      this.$nextTick(() => {
        if (flag === false) {
          this.$refs.currentDeskRef.restoreLayout(1)
        } else {
          this.$refs.currentDeskRef.restoreLayout()
        }

      })
    },
    showMore() {
      this.$emit('showMore')
    },
    setCurrentDeskId(id) {
      this.$emit('update:currentDeskId', id)
    },
    showAll() {
      this.allDeskListVisible = true
    }
  }
}
</script>


<style scoped lang="scss">
.tabs {
  .tab {
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
    line-height: 38px;
    font-size: 15px;
    min-width: 150px;
    border-radius: 4px;
    margin-right: 10px;
    padding-left: 10px;
    padding-right: 10px;
    text-align: center;
  }

  .more {
    min-width: 80px;
  }

  .home {

    min-width: 90px;
  }

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

.tab-bg {
  background: var(--primary-bg);
  color: var(--primary-text);

}
</style>
