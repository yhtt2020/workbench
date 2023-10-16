<template>

    <div class="flex flex-row items-center w-full h-16 p-3 mb-2 pointer">
    <div class="flex items-center justify-center w-10 h-10 rounded-lg xt-bg xt-text" style="background:rgb(80, 80, 80);"
      v-if="item.type === 'systemApp'">
      <navIcon style="font-size: 24px" :icon="item.icon" class="w-10 h-10"></navIcon>
    </div>
    <a-avatar :size="40" shape="square" :src="item.icon" v-else></a-avatar>

    <div class="flex flex-col items-start w-10/12 m-3">
      <div class="font-medium xt-text">{{ item.name }}</div>
      <div class="text-xs text-left text-more xt-text" style="width: calc(100%)" v-if="item.summary !== ''">{{ item.summary }}</div>
    </div>
  </div>
</template>

<script>
import {Icon as navIcon} from '@iconify/vue'
export default {
  name: "listItem",
  props: {
    item: {
      type: Object,
      default: () => { }
    }
  },
  components: {
    navIcon
  }
}
</script>

<style scoped></style>
