<template>
  <!-- 详情快捷方案 -->
  <div class="detail-box">
    <!-- 头部导航 -->
    <div class="flex justify-between items-center" style="height: 72px;width:98%">
      <div class="flex items-center">
        <div @click="onBack"
             class="pointer button-active xt-mask-2 xt-text h-12 w-12 flex items-center rounded-lg justify-center mr-3">
          <Icon icon="xiangzuo" style="font-size: 1.5em;"></Icon>
        </div>
        <div class="flex">
          <div v-for="(item,index) in schemeList.slice(0,3)" :key="item.id" class="head-list"
               :class="navIndex === index ? 'xt-mask-2':''" @click="switchScheme(index,item)">
          <span>
            <a-avatar shape="square" :src="item.icon" :size="38"></a-avatar>
          </span>
            <span class="ml-2 xt-text" style="font-size: 16px;">{{ item.name }}</span>
          </div>
        </div>
        <div @click="recentlyUsedVisible = true"
             class="pointer button-active xt-mask-2 xt-text h-12 w-12 flex items-center rounded-lg justify-center">
          <Icon icon="gengduo1" style="font-size: 1.5em;"></Icon>
        </div>
      </div>
      <div class="flex">
        <a-tooltip placement="left">
          <template #title>展开或收起分类栏</template>
          <div @click="toggleSlide"
               class="pointer button-active xt-mask-2 xt-text h-12 w-12 flex items-center rounded-lg justify-center mr-3">
            <Icon icon="outdent" style="font-size: 1.5em;"></Icon>
          </div>
        </a-tooltip>
        <div class="pointer button-active xt-mask-2 xt-text h-12 w-12 flex items-center rounded-lg justify-center"
             @click="openSet = true">
          <Icon icon="shezhi" style="font-size: 1.5em;"></Icon>
        </div>
      </div>
    </div>
    <div class="key-list">
      <!-- 侧边栏 -->
      <div class="side-nav" v-if="currentScheme.showSide">
        <XtScrollbar :x="false" :y="true">
        <Search v-model:keywords="keywords" inputStyle="width:100%;" placeholder="搜索"></Search>
        <div class="nav-box">
          <a-tooltip v-for="(item,index) in sideNav" placement="left" :title="item.groupName">
            <div class="nav-item  truncate " :style="{backgroundColor:getColor(this.sideNav,index)}"
                 :key="item.id"
                 @click="updateNavIndex(item, index)">
              {{ item.groupName }}
            </div>
          </a-tooltip>
        </div>
        </XtScrollbar>
      </div>
      <!-- 快捷键列表 -->
      <vue-custom-scrollbar id="scrollCus" :settings="settingsScroller" style="height:100%;"
                            :style="{width:showSide ? '80%;' : '100%',zoom:settings.zoom}">
        <div v-if="keyList.length===0" class="text-center pt-10 flex justify-center items-center">
          此方案暂时没有任何快捷键
          <xt-button class="ml-6" @click="btnEdit" type="theme" size="mini" :w="80" :h="40">编辑方案</xt-button>


        </div>
        <div class="key-box" :style="keyBoxStyle">

          <div v-for="(item,index) in filteredKeyList" :key="item.id">
            <!-- 分组名称 -->
            <div :id="'groupId_' + item.id" class="key-item border-right " style="margin-top: 15px"
                 v-if="item.groupName"
                 :style="item.id === currentGroup.id ? activeGroup : ''">
              <span class="truncate font-bold">  <div class="color-dot"
                                                      :style="{backgroundColor:getColor(this.filteredKeyList,index)}"></div> {{
                  item.groupName
                }}</span>
            </div>
            <!-- 快捷键 -->
            <div v-else class="border-right key-item"
                 :class="{active:keyIndex === item.id,'rounded-top':isGroupFirst(this.filteredKeyList,index) ,'rounded-bottom':isGroupLast(this.filteredKeyList,index)}"
                 :style="{backgroundColor:getColor(this.filteredKeyList,index)}"
                 @click="setKeyItem(item)">
              <div class="flex w-full">
                <div v-for="i in item.keys" :key="i" class="flex">
                  <span style="min-width:32px;padding:0 8px;"
                        class="xt-mask h-8 flex items-center rounded-lg justify-center mr-3">{{ i }}</span>
                </div>
                <div class="key-title ">{{ item.title }}</div>
              </div>

              <div>
                <div v-if="item.addNote" class="text-note">
                  <span class="note-val">{{ item.noteVal }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </vue-custom-scrollbar>
    </div>
    <div class=" p-2  " style="border-top: 1px solid  var(--divider);margin-left: -12px">
      <a-tooltip title="自动根据当前聚焦窗口切换快捷键方案，仅对具备至少1个快捷键方案的应用有效。">
        <strong>自动切换方案：</strong></a-tooltip>
      <a-switch v-model:checked="settings.enableAutoEnter"></a-switch>
      <span class="ml-2" v-if="!isWin()">非Windows平台暂不支持自动切换快捷键方案！</span>
      <span class="ml-2 mr-2 xt-text-2">| </span>
      <a-tooltip title="开启辅助模式后，工作台将不再聚焦，开启后才可以使用点击触发快捷键。">
        <strong>辅助模式：</strong></a-tooltip>
      <a-switch @click="ensureAided" v-model:checked="aided"></a-switch>
      <div class="float-right flex">
        <xt-button v-if="settings.zoom!==1" @click="resetZoom" size="mini" :w="40" :h="30">
          <xt-new-icon icon="fluent:arrow-clockwise-48-filled"></xt-new-icon>
        </xt-button>
        <span class="mr-2 p-1">{{(settings.zoom*100).toFixed(0)}}%</span>
        <xt-button @click="zoomUp" size="mini" class="mr-2" :w="40" :h="30">+</xt-button>
        <xt-button class="mr-2" @click="zoomDown" size="mini" :w="40" :h="30">-</xt-button>

      </div>
    </div>
  </div>

  <!-- 最近使用 -->
  <a-drawer v-model:visible="recentlyUsedVisible" title="最近使用" width="500" placement="right">
    <div class="main-part">
      <div v-for="(item,index) in schemeList" class="flex items-center mb-4 pointer" @click="switchScheme(index,item)">
            <span class="mx-4 h-14 w-14 flex justify-center items-center">
                <a-avatar shape="square" :src="item.icon" :size="48"></a-avatar>
            </span>
        <span>{{ item.name }}</span>
        <div class="flex flex-col justify-center items-center">
          <span>{{ item.number }}</span>
          <span>{{ item.key }}</span>
        </div>
      </div>
    </div>
  </a-drawer>
  <!-- 设置 -->
  <a-drawer v-model:visible="openSet" title="设置" width="500" placement="right">
    <span class="set-title" v-if="appContent.isCommunity">该快捷键方案来自创意市场</span>
    <span class="set-title"
          v-else-if="appContent.isMyCreate && appContent.isShare">该快捷键方案由我创建，并已分享至创意市场</span>
    <span class="set-title"
          v-else-if="appContent.isMyCreate && !appContent.isShare">该快捷键方案未分享至创意市场，仅本地可用</span>
    <div class="pointer recommend">
      <div class="flex justify-between">
        <div class="flex">
          <span class="h-14 w-14 flex justify-center items-center">
            <a-avatar shape="square" :src="appContent.icon" :size="48"></a-avatar>
          </span>
          <span class="flex flex-col ml-4 flex-1">
            <span class="xt-text truncate" style="font-size: 16px;font-weight: 500;">{{ appContent.name }}</span>
            <span class="mt-1 xt-text-2 summary">{{ appContent.commonUse }}</span>
          </span>
        </div>
        <div class="flex flex-col justify-center items-center    xt-mask rounded-lg p-5"
             style="min-width: 100px;height:78px">
          <span class="xt-text"
                style="font-size: 24px;font-weight: 600;">{{ appContent.number }}</span>
          <span>{{ appContent.key }}</span>
        </div>
      </div>
      <div v-if="false" class="flex justify-between items-center mt-4 xt-text-2" style="font-size: 14px;">
        <span class="flex items-center">
          <div @click="showCard(appContent.id)">
            <a-avatar shape="square" :src="appContent.avatar" :size="32"></a-avatar>
          </div>
          <span class="ml-3">{{ appContent.nickName }}</span>
        </span>
        <span v-if="appContent.isCommunity || appContent.isShare">
          <span>
            <Icon icon="dianzan" class="mr-2"></Icon>
            <span>{{ appContent.sumLikes }}</span>
          </span>
          <span class="ml-3">
            <Icon icon="xiazai" class="mr-2"></Icon>
            <span>{{ appContent.download }}</span>
          </span>
        </span>
      </div>
    </div>
    <!--    <div class="set-item" v-if="!appContent.isMyCreate">-->
    <!--      <Icon icon="xiazai" class="mr-2"></Icon>-->
    <!--      <span>下载更新</span>-->
    <!--    </div>-->
    <!--    <div class="set-item" v-if="appContent.isMyCreate && !appContent.isShare" @click="share">-->
    <!--      <Icon icon="upload" class="mr-2"></Icon>-->
    <!--      <span>立即上传</span>-->
    <!--    </div>-->
    <div class="set-item" v-if="!appContent.isMyCreate">
      <Icon icon="dianzan" class="mr-2"></Icon>
      <span>点赞</span>
    </div>
    <div class="set-item" @click="btnEdit">
      <Icon icon="bianji" class="mr-2"></Icon>
      <span>编辑方案</span>
    </div>
    <div class="set-item" @click="btnDel">
      <Icon icon="delete" class="mr-2"></Icon>
      <span>删除</span>
    </div>
  </a-drawer>


</template>

<script>
import NotShortcutKey from '../page/NotShortcutKey.vue'
// import ShortcutKeyList from '../../components/shortcutKey/ShortcutKeyList.vue'
import Search from '../../../components/Search.vue'
import { mapActions, mapWritableState } from 'pinia'
import { keyStore } from '../store'
import { message, Modal } from 'ant-design-vue'
import { isGroupLast, isGroupFirst } from '../lib/lib'
import XtButton from '../../../ui/libs/Button/index.vue'
import { isWin } from '../../../js/common/screenUtils'
import * as shorcutTools from '../shortcutTools'
import { appStore } from '../../../store'
export default {
  name: 'ShortcutKeyDetail',
  components: {
    XtButton,
    NotShortcutKey,
    // ShortcutKeyList,
    Search
  },
  data () {
    return {
      navIndex: 0,
      keyIndex: 1,
      recentlyUsedVisible: false,
      keywords: '',//搜索关键词
      openSet: false,
      //最近使用的方案
      schemeList: [],
      //快捷键列表
      keyList: [],
      isData: true,
      // 单个app的内容
      appContent: {},
      sideNav: [],
      currentIndex: 0,
      // 是否显示侧边栏
      showSide: false,
      // 当前分组
      currentGroup: {},
      activeGroup: {},
      settingsScroller: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: true,
        suppressScrollX: false,
        wheelPropagation: true
      },
    }
  },
  computed: {
    ...mapWritableState(appStore, ['aided']),
    ...mapWritableState(keyStore, ['recentlyUsedList', 'currentApp', 'settings', 'currentScheme', 'settings']),
    filteredKeyList () {
      if (this.keywords) {
        var regExp = new RegExp(this.keywords, 'i')
        return this.keyList.filter(key => {
          if (key.title) {
            return key.title.match(regExp)
          }
          return false
        })
      } else {
        return this.keyList
      }
    }
  },
  mounted () {
    this.getData()
  },
  watch: {
    currentApp: {
      async handler () {
        if (this.settings.enableAutoEnter) {
          this.shortcutSchemeList = await this.loadShortcutSchemes(this.currentApp.exeName)
          if (this.shortcutSchemeList.length > 0) {
            await this.setRecentlyUsedList(this.shortcutSchemeList[0])
            this.navIndex = 0
            this.getData()
          }

        }
      },
      deep: true
    }
  },
  methods: {
    ...mapActions(keyStore, ['removeShortcutKeyList', 'setMarketList', 'loadShortcutSchemes', 'setRecentlyUsedList', 'saveScheme']),
    ...mapActions(appStore, ['enterAided', 'leaveAided']),
    isWin, isGroupLast, isGroupFirst,
    zoomUp(){
      this.settings.zoom+=0.1
    },
    zoomDown(){
      this.settings.zoom-=0.1
    },
    resetZoom(){
      this.settings.zoom=1
    },
    ensureAided () {
      if (this.aided) {
        this.enterAided()
      } else {
        this.leaveAided()
      }
    },
    getColor (array, index, field = 'groupName') {
      for (let i = index; i >= 0; i--) {
        if (array[i][field]) {
          //是组
          return array[i].color
        }
      }
      return index
    },
    /**
     * 切换侧边导航是否显示
     */
    toggleSlide () {
      this.currentScheme.showSide = !this.currentScheme.showSide
      this.saveScheme(this.currentScheme)
    },
    getData () {
      this.schemeList = this.recentlyUsedList
      if (this.schemeList.length === 0) {
        this.$router.replace({ name: 'home' })
        return
      }
      this.currentScheme = this.schemeList[0]
      if (!!!this.currentScheme) {
        this.$router.replace({ name: 'home' })
        return
      }

      this.keyList = this.currentScheme.keyList
      this.appContent = this.schemeList[0]
      if (!this.keyList.length) this.isData = false
      this.sideNav = this.keyList.filter(i => i.groupName)
      if (this.currentScheme.showSide === undefined) {
        //如果从未设置是否显示侧边栏，则根据侧边栏的数量，自动给一个值
        if (this.sideNav.length < 4) {
          this.currentScheme.showSide = false
        } else {
          this.currentScheme.showSide = true
        }
        this.saveScheme(this.currentScheme)
      }

    },
    /**
     * 切换方案
     * @param index
     * @param item
     */ async switchScheme (index, item) {
      await this.setRecentlyUsedList(item)
      this.currentScheme = item
      this.navIndex = index
      this.keyList = item.keyList
      this.appContent = item
      this.currentIndex = 0
      this.sideNav = this.keyList.filter(i => i.groupName)
      this.recentlyUsedVisible = false
      this.getData()
      this.navIndex = 0

    },
    setKeyItem (item) {

      shorcutTools.doKey(item)
      this.keyIndex = item.id
    },
    onBack () {
      this.$router.go(-1)
    },
    btnEdit () {
      this.openSet = false
      this.$router.push({ name: 'shareKey', params: { id: this.appContent.id } })
    },
    async btnDel () {
      Modal.confirm({
        centered: true,
        content: '是否删除此方案？此操作不可恢复。',
        onOk: async () => {
          await this.removeShortcutKeyList(this.appContent)
          message.success('删除成功')
          this.onBack()
        }
      })

    },
    updateNavIndex (item, index) {
      let groupId = document.getElementById('groupId_' + item.id)
      this.currentIndex = index
      this.currentGroup = item
      this.activeGroup = {
        background: 'var(--active-bg)'
      }
      setTimeout(() => {
        this.activeGroup = {}
      }, 500)
      let marginLeft = getComputedStyle(groupId, null).marginLeft
      document.getElementById('scrollCus').scrollLeft = groupId.offsetLeft - parseInt(marginLeft.split('p')[0])
    },
    share () {
      if (!this.appContent.keyList.length) return message.info('无快捷键列表，请前往编辑')
      this.appContent.isShare = true
      this.setMarketList(this.appContent)
      message.success('上传成功')
      this.openSet = false
    }
  },
}
</script>

<style lang="scss" scoped>
.detail-box {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.button-active {
  &:hover {
    opacity: 0.8;
  }
}

.s-bg {
  box-shadow: none !important;
}

.main-part {
  > div {
    background: var(--secondary-bg);
    border-radius: 12px;
    width: 452px;
    height: 88px;
    position: relative;

    > div {
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      width: 88px;
      height: 88px;
      background: var(--mask-bg);
      border-radius: 0px 12px 12px 0px;

      > span:nth-child(1) {
        font-family: Oswald-SemiBold;
        font-size: 28px;
        color: var(--primary-text);
        font-weight: 600;
      }
    }
  }

  > div:last-child {
    margin-bottom: 0;
  }
}

.head-list {
  margin-right: 12px;
  padding: 6px 12px;
  cursor: pointer;
  border-radius: 12px;
  min-width: 80px;
  white-space: nowrap;
}

.recommend {
  margin: 24px 0;
  background: var(--secondary-bg);
  border-radius: 12px;
  // width: 452px;
  height: 105px;
  padding: 12px;

  .summary {
    font-size: 14px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-all;
    margin-right: 10px;
  }
}

.set-title {
  font-size: 16px;
  color: var(--primary-text);
  font-weight: 500;
}

.set-item {
  background: var(--secondary-bg);
  border-radius: 12px;
  // width: 452px;
  height: 48px;
  margin-bottom: 16px;
  font-size: 16px;
  color: var(--primary-text);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.key-list {
  height: 0;
  flex: 1;
  background: var(--main-mask-bg);
  margin-bottom: 10px;
  margin-right: 10px;
  border-radius: 12px;
  display: flex;

  .side-nav {
    width: 200px;
    // width: 20%;
    height: 100%;
    background: var(--mask-bg);
    border-top-left-radius: 12px;
    border-bottom-left-radius: 12px;
    padding: 16px;

    .nav-box {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-top: 10px;
      flex-wrap: wrap;
      align-content: center;
      justify-content: flex-start;
      align-items: center;

      .nav-item {
        width: 100%;
        background: var(--secondary-bg);
        // width: 104px;
        padding: 10px;
        border-radius: 12px;
        font-size: 16px;
        color: var(--primary-text);
        text-align: left;
        cursor: pointer;
      }

      .nav-item:hover {
        opacity: 0.8;
      }
    }
  }
}

.key-box {
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-content: flex-start;
  // overflow: auto;
  padding: 24px 0;
  flex-wrap: wrap;
  height: 100%;
  width: 100%;

}

.key-box::-webkit-scrollbar {
  display: none;
}

.key-item {
  padding: 0 12px;
  margin: 0 20px 10px;
  margin-top: 0;
  margin-bottom: 0;
  width: 350px;
  line-height: 1.2;
  padding-top: 10px;
  padding-bottom: 10px;
  vertical-align: text-top;
  font-size: 16px;
  color: var(--primary-text);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  cursor: pointer;
  border-bottom: 1px solid;
  flex-direction: column;
  border-bottom-color: var(--secondary-bg);

  .key-title {
    flex: 1;
    width: 0;
    padding-top: 4px;
    text-align: right;
  }

}

.border-right {
  position: relative;
}

.border-right::after {
  content: '';
  position: absolute;
  right: -20px;
  top: 0;
  height: 110%;
  margin-left: 10px;
  // border-right: solid rgba(255, 245, 245, 0.1) 1px;
  border-right: solid 1px var(--divider-solid);
}

.s-bg {
  box-shadow: none !important;
}


.text-note {
  margin-top: 5px;
  margin-bottom: 5px;
  padding: 0 3px;
  text-align: left;
}

.note-val {
  position: relative;
  font-size: 14px;
  color: var(--secondary-text);
}

.text-note::after {
  content: '';
  position: absolute;
  right: -20px;
  top: 0;
  height: 30px;
  margin-left: 10px;
  border-right: solid rgba(255, 255, 255, 0.1) 1px;
}

.active {
  background: var(--mask-bg);
  border-radius: 10px
}

.rounded-top {
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.rounded-bottom {
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
}
</style>
