<script lang="ts">
import {defineComponent} from 'vue'
import { Icon as newIcon } from '@iconify/vue';
export default defineComponent({
  name: "Cover",
  components:{newIcon},
  props: [
    'cover',
    'store',
    'bg'
  ]
})
</script>

<template>
  <div class="rounded-xl overflow-hidden" v-if="store==='jd' || store==='tb'">
    <a-avatar  :size="50"  shape="square" :src="cover"></a-avatar>
  </div>

  <div v-else class="w-[52px] h-[52px] rounded-xl  flex justify-center items-center pointer" :class="{'xt-bg-2':!bg}" :style="{background:bg}">
    <newIcon icon="fluent-emoji:package" style="font-size: 32px;text-align: center;"></newIcon>
  </div>

</template>

<style scoped lang="scss">

</style>
