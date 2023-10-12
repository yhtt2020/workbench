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
          <div v-for="(item,index) in appList.slice(0,3)" :key="item.id" class="head-list"
               :class="navIndex === index ? 'xt-mask-2':''" @click="toggleApp(index,item)">
          <span>
            <a-avatar shape="square" :src="item.icon" :size="38"></a-avatar>
          </span>
            <span class="ml-2 xt-text" style="font-size: 16px;">{{ item.name }}</span>
          </div>
        </div>
        <div @click="recentlyUsed = true"
             class="pointer button-active xt-mask-2 xt-text h-12 w-12 flex items-center rounded-lg justify-center">
          <Icon icon="gengduo1" style="font-size: 1.5em;"></Icon>
        </div>
      </div>
      <div class="flex">
        <a-tooltip placement="left">
          <template #title>展开或收起分类栏</template>
          <div @click="showSide = !showSide"
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
      <div class="side-nav" v-if="showSide">
        <Search inputStyle="width:220px;" placeholder="搜索"></Search>
        <div class="nav-box">
          <div class="nav-item"
               v-for="(item,index) in sideNav" :key="item.id"
               @click="updateNavIndex(item, index)">
            {{ item.groupName }}
          </div>
        </div>
      </div>
      <!-- 快捷键列表 -->
      <vue-custom-scrollbar id="scrollCus" :settings="settingsScroller" style="height:100%;"
                            :style="showSide ? 'width: 80%;' : 'width:100%'">
        <div class="key-box" :style="keyBoxStyle">
          <div v-for="(item,index) in keyList" :key="item.id">
            <!-- 分组名称 -->
            <div :id="'groupId_' + item.id" class="key-item border-right" v-if="item.groupName"
                 :style="item.id === currentGroup.id ? activeGroup : ''">
              <span class="truncate font-bold">{{ item.groupName }}</span>
            </div>
            <!-- 快捷键 -->
            <div v-else class="border-right key-item" :style="keyIndex === item.id ? 'background: var(--mask-bg); border-radius: 10px':''"
                 @click="setKeyItem(item.id)">
              <div class="flex w-full">
                <div v-for="i in item.keys" :key="i" class="flex">
                  <span style="min-width:32px;padding:0 8px;"
                        class="xt-mask h-8 flex items-center rounded-lg justify-center mr-3">{{ i }}</span>
                </div>
                <div class="key-title ">{{ item.title }}</div>
              </div>

              <div>    <div v-if="item.addNote" class="text-note">
                <span class="note-val">{{ item.noteVal }}</span>
              </div></div>
            </div>

          </div>
        </div>
      </vue-custom-scrollbar>
    </div>
  </div>

  <!-- 最近使用 -->
  <a-drawer v-model:visible="recentlyUsed" title="最近使用" width="500" placement="right">
    <div class="main-part">
      <div v-for="(item,index) in appList" class="flex items-center mb-4 pointer" @click="toggleApp(index,item)">
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
          <span class="flex flex-col ml-4">
            <span class="xt-text" style="font-size: 18px;font-weight: 500;">{{ appContent.name }}</span>
            <span class="mt-1 xt-text-2" style="font-size: 16px;">{{ appContent.commonUse }}</span>
          </span>
        </div>
        <div class="flex flex-col justify-center items-center w-16 h-16 xt-mask rounded-lg">
          <span class="xt-text"
                style="font-family: Oswald-SemiBold;font-size: 24px;font-weight: 600;">{{ appContent.number }}</span>
          <span>{{ appContent.key }}</span>
        </div>
      </div>
      <div class="flex justify-between items-center mt-4 xt-text-2" style="font-size: 14px;">
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
    <div class="set-item" v-if="!appContent.isMyCreate">
      <Icon icon="xiazai" class="mr-2"></Icon>
      <span>下载更新</span>
    </div>
    <div class="set-item" v-if="appContent.isMyCreate && !appContent.isShare" @click="share">
      <Icon icon="upload" class="mr-2"></Icon>
      <span>立即上传</span>
    </div>
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

export default {
  name: 'ShortcutKeyDetail',
  components: {
    NotShortcutKey,
    // ShortcutKeyList,
    Search
  },
  data () {
    return {
      navIndex: 0,
      keyIndex: 1,
      recentlyUsed: false,
      openSet: false,
      //最近使用的方案
      appList: [],
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
    ...mapWritableState(keyStore, ['recentlyUsedList', 'currentApp', 'settings'])
  },
  mounted () {
    this.getData()
  },
  watch: {
    currentApp: {
      async handler () {
        if (this.settings.enableAutoEnter) {
          this.shortcutSchemeList = await this.loadShortcutSchemes(this.currentApp.exeName)
          if(this.shortcutSchemeList.length>0){
            this.setRecentlyUsedList(this.shortcutSchemeList[0])
            this.getData()
          }

        }
      },
      deep:true
    }
  },
  methods: {
    ...mapActions(keyStore, ['removeShortcutKeyList', 'setMarketList','loadShortcutSchemes','setRecentlyUsedList']),
    getData () {
      this.appList = this.recentlyUsedList
      this.keyList = this.appList[0].keyList
      this.appContent = this.appList[0]
      if (!this.keyList.length) this.isData = false
      this.sideNav = this.keyList.filter(i => i.groupName)

      if (this.sideNav.length < 4) {
        this.showSide = false
      } else {
        this.showSide = true
      }
    },
    toggleApp (index, item) {
      this.navIndex = index
      this.keyList = item.keyList
      this.appContent = item
      this.currentIndex = 0
      this.sideNav = this.keyList.filter(i => i.groupName)
    },
    setKeyItem (id) {
      this.keyIndex = id
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
        centered:true,
        content:'是否删除此方案？此操作不可恢复。',
        onOk:async () => {
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
  height: 136px;
  padding: 12px;
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
  height:0;
  flex:1;
  background: var(--main-mask-bg);
  margin-bottom: 10px;
  margin-right: 10px;
  border-radius: 12px;
  display: flex;

  .side-nav {
    min-width: 252px;
    max-width: 253px;
    // width: 20%;
    height: 100%;
    background: var(--mask-bg);
    border-top-left-radius: 12px;
    border-bottom-left-radius: 12px;
    padding: 16px;

    .nav-box {
      width: 100%;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;

      .nav-item {
        // width: 104px;
        width: 48%;
        height: 48px;
        border-radius: 12px;
        margin: 12px 0 0;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 16px;
        color: var(--primary-text);
      }

      .nav-item:hover {
        background: var(--active-bg);
        color: var(--primary-text);
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
  margin-top:0;
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
  border-bottom-color:  var(--secondary-bg);
  .key-title{
    flex:1;
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
  height:110%;
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


</style>
