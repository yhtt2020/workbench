<template>
<!--  {{ apps }}-->



  <!-- 有内容 -->
  <div class="container rounded-lg w-full" v-if="schemeList.length && !detailToggle">
    <div class="flex justify-between px-4">
      <div class="flex items-center">
        <Search :searchValue="searchValue" @changeInput="changeInput"></Search>
        <span class="ml-3" style="font-size: 16px;color: var(--secondary-text);width:200px;">共{{
            schemeList.length
          }}个应用快捷键方案</span>
      </div>
      <div class="btn-item">
        <div class="pointer" @click="market">创意市场</div>
        <div class="pointer" @click="share">我来分享</div>
        <span class="button-active pointer" @click="setShow = true">
                <Icon icon="setting" style="width: 20px;height: 20px;color:var(--primary-text);"></Icon>
            </span>
      </div>
    </div>
    <!-- 提示 -->
    <div class="prompt mt-4 mx-4 px-4 flex justify-between items-center" v-show="closePrompt">
        <span class="flex items-center">
            <Icon icon="tishi-xianxing" style="width: 21px;height: 21px;color:var(--active-bg);"></Icon>
            <span class="mx-4 xt-text">从工作台启动的Windows应用，默认会自动打开可用的快捷键方案。</span>
        </span>
      <Icon icon="guanbi2" class="pointer" style="width: 20px;height: 20px;color:#7A7A7A;"
            @click="closePrompt = false"></Icon>
    </div>
    <!-- 列表 -->
    <div class="mb-2  rounded-md px-2 m-2">
      <div hidden="">
        - {{ currentApp.pid }} - {{ currentApp.title }}
      </div>
      <div hidden="" class="xt-text-2">
        {{ currentApp.path }}
      </div>
      <div hidden="">{{ currentApp.lastFocus }}</div>
      <div class="xt-bg p-2 rounded-md my-1 truncate">
        <a-avatar shape="square" :src="currentApp.software.icon"></a-avatar>
        {{ currentApp.software.alias }}
        <div v-if="!currentApp.inRep" class="mt-2">
          <xt-button type="theme" size="mini" style="width:100%" :h="36">登记入库</xt-button>
        </div>
      </div>

    </div>
    <div class="main-part item-content" :style="closePrompt ? 'height:80%' : 'height:90%'">
      <div v-for="item in schemeList" class="flex items-center pointer" @click="btnDetail(item)">
            <span class="mx-4 h-14 w-14 flex justify-center items-center">
                <a-avatar shape="square" :src="item.icon" :size="48"></a-avatar>
            </span>
        <span class="xt-text">{{ item.name }}</span>
        <div class="flex flex-col justify-center items-center">
          <span>{{ item.number }}</span>
          <span class="xt-text-2" style="font-size: 14px;">快捷键</span>
        </div>
      </div>
      <div v-if="schemeList.length > 2" style="opacity:0;height: 1px;"></div>
      <div v-if="schemeList.length > 2" style="opacity:0;height: 1px;"></div>
    </div>
  </div>


  <!-- 设置抽屉 -->
  <a-drawer v-model:visible="setShow" title="设置" width="500" placement="right">
    <div class="drawer-content">
      <div>
        <div class="title">应用启动时打开</div>
        <span class="text">从工作台打开应用时，自动打开快捷方案</span>
      </div>
      <div class="switch">
        <a-switch v-model:checked="schemeSwitch"/>
      </div>
    </div>
  </a-drawer>
  <!-- 快捷键详情 -->


</template>

<script>
import NotShortcutKey from './NotShortcutKey.vue'
import ShortcutKeyDetail from '../shortcutKey/ShortcutKeyDetail.vue'
import Search from '../../../components/Search.vue'
import { mapActions, mapWritableState } from 'pinia'
import { keyStore } from '../store'
import XtButton from '../../../ui/libs/Button/index.vue'



export default {
  name: 'ShortcutKey',
  components: {
    XtButton,
    ShortcutKeyDetail,
    Search,
    NotShortcutKey
  },
  data () {
    return {

      // 跳转详情
      detailToggle: false,
      //提示开关
      closePrompt: true,
      // 快捷键方案
      //推荐方案
      // notDownloadList: [
      //     {
      //         id: 1,
      //         icon: 'http://a.apps.vip/icons/flappy.jpg',
      //         name: 'Adobe Lightroom',
      //         number: 92,
      //         commonUse: 'Lr常用26个快捷键',
      //         avatar: '',
      //         userName: 'Victor Ruiz',
      //         sumLikes: 12334,
      //         download: 1232,
      //     },
      //     {
      //         id: 2,
      //         icon: 'http://a.apps.vip/icons/flappy.jpg',
      //         name: 'Adobe Lightroom',
      //         number: 92,
      //         commonUse: 'Adobe XD',
      //         avatar: '',
      //         userName: 'Victor Ruiz',
      //         sumLikes: 12334,
      //         download: 1232,
      //     },
      //     {
      //         id: 3,
      //         icon: 'http://a.apps.vip/icons/flappy.jpg',
      //         name: 'Adobe Lightroom',
      //         number: 92,
      //         commonUse: 'Lr常用26个快捷键',
      //         avatar: '',
      //         userName: 'Victor Ruiz',
      //         sumLikes: 12334,
      //         download: 1232,
      //     },
      //     {
      //         id: 4,
      //         icon: 'http://a.apps.vip/icons/flappy.jpg',
      //         name: 'Adobe Lightroom',
      //         number: 92,
      //         commonUse: 'Lr常用26个快捷键',
      //         avatar: '',
      //         userName: 'Victor Ruiz',
      //         sumLikes: 12334,
      //         download: 1232,
      //     },
      //     {
      //         id: 5,
      //         icon: 'http://a.apps.vip/icons/flappy.jpg',
      //         name: 'Adobe Lightroom',
      //         number: 92,
      //         commonUse: 'Lr常用26个快捷键',
      //         avatar: '',
      //         userName: 'Victor Ruiz',
      //         sumLikes: 12334,
      //         download: 1232,
      //     },
      //     {
      //         id: 6,
      //         icon: 'http://a.apps.vip/icons/flappy.jpg',
      //         name: 'Adobe Lightroom',
      //         number: 92,
      //         commonUse: 'Lr常用26个快捷键',
      //         avatar: '',
      //         userName: 'Victor Ruiz',
      //         sumLikes: 12334,
      //         download: 1232,
      //     },
      // ],
      //搜索框的值
      searchValue: '',
      // 设置抽屉显示
      setShow: false,
      // 快捷键方案
      schemeSwitch: true
    }
  },
  computed: {
    ...mapWritableState(keyStore, ['shortcutKeyList','schemeList','currentApp']),
  },
  mounted () {
    this.detailToggle = false
    this.loadShortcutSchemes()

  },


  methods: {
    ...mapActions(keyStore, ['setRecentlyUsedList','loadShortcutSchemes']),
    //点击跳转到详情页
    btnDetail (item) {
      this.setRecentlyUsedList(item)
      this.detailToggle = true
    },
    detailShow (val) {
      this.detailToggle = val
    },
    //跳转到分享页
    share () {
      this.$router.push({ name: 'shareKey' })
    },
    // 跳转到创意市场
    market () {
      this.$router.push({ name: 'creativeMarket' })
    },
    changeInput (event) {
      // console.log('输入框',event)
    },
  },
}
</script>

<style scoped lang="scss">
.container {
  padding: 16px 0;
  //   width: 1164px;
  //   height: 568px;
  height: 98%;
  width: 98%;
  overflow: hidden;
}






.recommend {
  background: var(--mask-bg);
  border-radius: 12px;
  width: 356px;
  height: 136px;
  margin: 0 8px 16px;
  padding: 12px;
}

.button-active {
  &:active {
    filter: brightness(0.8);
    background: rgba(42, 42, 42, 0.25);
  }

  &:hover {
    background: rgba(42, 42, 42, 0.25);
  }
}

.drawer-content {
  display: flex;
  align-content: center;
  justify-content: space-between;

  .switch {
    display: flex;
    align-items: center;
  }

  .title {
    font-size: 16px;
    color: var(--primary-text);
    font-weight: 500;
    margin-bottom: 8px;
  }

  .text {

    font-size: 14px;
    color: var(--secondary-text);
    font-weight: 500;
  }
}
</style>


