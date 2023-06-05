<template>
  <!-- 快速搜索 最外层 左侧菜单 -->
  <ul class="box side-panel common-panel s-bg" style=" z-index: 999;
  width: 6em; background: var(--primary-bg)">
    <li class="" style="color:#000">
      <PanelButton :active="tab === 'home'" @click="goTab('main', 'home')" icon="shouye1" title="主页">
      </PanelButton>
    </li>
    <li>
      <PanelButton :active="tab === 'apps'" @click="goTab('apps')" icon="yingyongzhongxin" title="应用"></PanelButton>
    </li>
    <li>
      <PanelButton :active="tab === 'game'" @click="goGame()" iconStyle="width:2.5em;height:2.5em;margin-top:-0.4em;"
        icon="youxishoubing" title="游戏"></PanelButton>
    </li>
    <li>
      <PanelButton :active="tab === 'music'" @click="goTab('music')"
        iconStyle="width:2.5em;height:2.5em;margin-top:-0.4em;" icon="yinle1" title="音乐"></PanelButton>
    </li>

    <!--    <li>-->
    <!--      <PanelButton :active="tab==='todo'" @click="goApp" icon="daibanshixiang" title="待办"></PanelButton>-->
    <!--    </li>-->
    <li>
      <PanelButton :active="tab === 'deck'" @click="goTab('deck')" icon="kuaijie1" title="Deck"></PanelButton>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'SidePanel',
  data() {
    return {
      tab: 'home'
    }
  },
  methods: {
    goTab(tab, name) {
      if (!name) {
        name = tab
      }
      this.tab = name
      this.$router.push({
        path: '/' + tab
      })
    },
    goGame() {
      this.tab = 'game'
      this.$router.push({
        name: 'gameIndex'
      })
    },
    goApp() {
      this.goTab('todo')
      this.$router.push({
        name: 'app',
        params:
        {
          fullScreen: false,
          theme: 'transparent',
          name: 'todo',
          url: 'https://a.apps.vip/todo',
          background: true,
          node: true,
          security: true
        }
      }
      )
    }
  }
}
</script>

<style scoped lang="scss">
.box {
  :deep(.icon) {
    fill: var(--secondary-text);
  }
}


.item:hover {
  background: var( --active-secondary-bg) !important;
  :deep(.icon) {
    fill: var(--primary-text) !important
  }
}

.active {
  :deep(.icon) {
    fill: var(--primary-text) !important
  }
}

.item {
  margin: 8px;
}

@media screen and (max-height: 510px) {
  .side-panel {
    zoom: 0.82;
    margin-top: 3.5em;
  }
}

@media screen and (min-height: 511px) and (max-height: 550px) {
  .side-panel {
    zoom: 0.9;

  }
}

@media screen and (min-height: 551px) and (max-height: 610px) {
  .side-panel {
    zoom: 0.9;
  }
}
</style>
