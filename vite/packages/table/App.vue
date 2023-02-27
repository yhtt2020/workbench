<template>
  <a-config-provider :locale="locale">
    <div class="a-container " :class="{dark:settings.darkMod}">
      <router-view></router-view>
    </div>
  </a-config-provider>
</template>

<script lang="ts">
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import {mapActions, mapWritableState} from 'pinia'

import {appStore} from './store'

let startX, startY, moveEndX, moveEndY, X, Y = 0
export default {
  components: {},
  async mounted() {

    // this.getUserInfo()
    window.updateMusicStatusHandler = this.updateMusic
    this.loadAll()

    if (this.settings.darkMod) {
      document.body.style.background = 'rgb(50,50,50)'
    }
    const distX = 80
    const distY = 80
    $(".a-container").on("touchstart", function (e) {

      startX = e.originalEvent.changedTouches[0].pageX,
        startY = e.originalEvent.changedTouches[0].pageY;
    });
    $(".a-container").on("touchend", function (e) {
      moveEndX = e.originalEvent.changedTouches[0].pageX,
        moveEndY = e.originalEvent.changedTouches[0].pageY,
        X = moveEndX - startX,
        Y = moveEndY - startY;

      if (X > distX) {
        console.log("向右滑", distX);
        //e.preventDefault();
      } else if (X < -distX) {
        console.log("向左滑", distX);
        //e.preventDefault();
      } else if (Y > distY) {
        ipc.send('openGlobalSearch')
        e.preventDefault();
      } else if (Y < -distY) {
        console.log("向上滑", distY);
        //e.preventDefault();
      } else {
        console.log("just touch");
      }
    });
  },

  computed: {
    ...mapWritableState(appStore, ['settings', 'routeUpdateTime', 'userInfo'])
  },
  methods: {
    ...mapActions(appStore, ['setMusic', 'loadAll']),
    updateMusic(music) {
      this.setMusic(music)
    },
    ...mapActions(appStore, []),
    // async getUserInfo() {
    //   let rs = await tsbApi.user.get()
    //   if (rs.status === 1) {
    //     console.log(rs.data.user_info)
    //     this.userInfo=rs.data.user_info
    //   }
    // }

  },
  data() {
    return {
      locale: zhCN
    }
  }
}
</script>

<style>
@import './assets/common.css';

.a-container {
  width: 100%;
}
</style>
