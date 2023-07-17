<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: "Emoji",
  props:['icon'],
  methods:{
    getUrl(){
      return '/emoji/'+this.icon+'.png'
    }
  }
})
</script>

<template>
  <a-avatar :src="getUrl()"></a-avatar>
</template>

<style scoped lang="scss">

</style>
