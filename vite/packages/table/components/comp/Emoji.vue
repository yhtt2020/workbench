<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: "Emoji",
  props:['icon']
})
</script>

<template>
  <a-avatar :src="'/public/emoji/'+icon+'.png'"></a-avatar>
</template>

<style scoped lang="scss">

</style>
