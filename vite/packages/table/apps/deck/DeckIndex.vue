<template>
  <div :class="{'rounded-lg':!fullScreen}"
       class="flex h-full w-full   py-2" style="">
    <div class="w-full pr-2 h-full flex">
      <xt-left-menu v-model:index="currentIndex" :list="leftMenu" last="1" end="1" class="w-full">
        <router-view></router-view>
      </xt-left-menu>
    </div>
  </div>
</template>
<script lang="ts">

import {mapWritableState} from "pinia";
import {appStore} from "../../store";

export default {
  name: 'deckIndex',
  data() {
    return {
      currentIndex: ''
    }
  },
  computed: {
    ...mapWritableState(appStore, ['fullScreen']),
    leftMenu() {
      var startMenu = [
        {
          id: 'list',
          icon: "liebiao",
          title: '快捷指令',
          tab: 'deck',
          // img: "/icons/bg.png",
          callBack: (id: 'create',) => {
            this.$router.push({name: 'deck'})
          },
        },
      ]

      const endMenu = [
        {
          full: true,
        },
        // {
        //   flag: true,
        //   id: 'setting',
        //   icon: "setting",
        //   callBack: () => {
        //     this.$router.push({
        //       name: 'deckSettings'
        //     })
        //   },
        // },
      ]
      return [
        ...startMenu,
        ...endMenu
      ]
    }
  }
}
</script>


<style scoped lang="scss">

</style>
