<template>
  <HomeComponentSlot :options="options">
    <div class="absolute inset-0 bg-cyan-300" style="border-radius: 8px;z-index: -1">

    </div>
  </HomeComponentSlot>
</template>

<script>
import HomeComponentSlot from "./HomeComponentSlot.vue";
export default {
  name: "MiddleWallpaper",
  components:{
    HomeComponentSlot
  },
  data(){
    return {
      options:{
        className:'card double',
        title:'壁纸',
        icon:'image',
        type:'MiddleWallpaper'
      },
    }
  },
}
</script>

<style scoped>

</style>
