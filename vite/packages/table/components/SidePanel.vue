<template>
  <ul class="side-panel common-panel suspension-background" style=" z-index: 999;
  width: 6em;">
    <li class="active">
      <PanelButton :active="tab==='home'" @click="goTab('main','home')" icon="shouye1" title="主页"></PanelButton>
    </li>
    <li>
      <PanelButton :active="tab==='apps'" @click="goTab('apps')" icon="yingyongzhongxin"
                   title="应用"></PanelButton>
    </li>
    <li>
      <PanelButton :active="tab==='music'" @click="goTab('music')"
                   iconStyle="width:2.5em;height:2.5em;margin-top:-0.4em;" icon="yinle1"
                   title="音乐"></PanelButton>
    </li>
    <li>
      <PanelButton :active="tab==='todo'" @click="goApp" icon="daibanshixiang" title="待办"></PanelButton>
    </li>
    <li>
      <PanelButton :active="tab==='deck'" @click="goTab('deck')" icon="kuaijie1" title="Deck"></PanelButton>
    </li>
  </ul>

</template>

<script>
export default {
  name: 'SidePanel',
  data () {
    return {
      tab: 'home'
    }
  },
  methods: {
    goTab (tab, name) {
      if (!name) {
        name = tab
      }
      this.tab = name
      this.$router.push({
        path: '/' + tab
      })
    },
    goApp () {
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
