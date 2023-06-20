<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: "SaveImage",
  props: ['image']
})
</script>

<template>
  <img class="rounded-lg" style="width:280px;border-radius: 10px" :src="image" alt="">
  <div class="mt-2">已截图保存至截屏目录下</div>
</template>

<style scoped lang="scss">

</style>
