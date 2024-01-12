<script lang="ts">
import {defineComponent} from 'vue'
import {mapWritableState} from "pinia";
import {appStore} from "../../../store";

export default defineComponent({
  name: "console",
  data() {
    return {
      leftMenu: [
        {
          id: 'fileTransfer',
          newIcon: "fluent:airplane-take-off-24-regular",
          title: '文件中转站',
          tab: 'fileTransfer',
          callBack: (id: 'create',) => {
            this.$router.push({name: 'fileHelper'})
          },
        },
        {
          id: 'share',
          newIcon: "fluent:share-24-regular",
          title: '分享',
          tab: 'share',
          // img: "/icons/bg.png",
          callBack: (id: 'create',) => {
            this.$router.push({name: 'fileTransfer'})
          },
        },
        {
          id: 'remote',
          newIcon: "fluent:dual-screen-tablet-24-regular",
          title: '远程桌面',
          tab: 'remote',
          callBack: () => {
            this.$router.push({name: 'remote'})
          },
        },
        {
          newIcon: 'fluent:hard-drive-24-regular',
          id: 'hdd',
          title: '资源管理',
          // img: "/icons/bg.png",
          tab: 'hdd',
          callBack: () => {
            this.$router.push({name: 'shortcutStore'})
          },
        },
        {
          flag: true,
          id: 'setting',
          icon: "setting",
          callBack: () => {
            this.$router.push({
              name: 'shortcutKeySettings'
            })
          },
        },],
      currentIndex: 'fileTransfer',

    }
  },
  computed: {
    ...mapWritableState(appStore, ['fullScreen'])
  }
})
</script>

<template>

  <div

    class="flex-1     h-full" style="display: flex; ">
    <div :class="{'rounded-lg':!fullScreen}"
         class="flex h-full w-full      " style="">
      <div class="w-full">
        <xt-left-menu v-model:index="currentIndex" :list="leftMenu" last="2" end="1" class="w-full">
          <div class=" h-full w-full">
            <router-view></router-view>
          </div>
        </xt-left-menu>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
