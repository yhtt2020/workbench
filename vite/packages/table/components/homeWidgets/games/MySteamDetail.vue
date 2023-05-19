<template>
  <div class="mt-3">
    <template v-if="cardSize === false">
       <div class="">
        
       </div>
    </template>
    <template v-else>
      <div class="flex justify-between">
        <div class="pr-4 flex flex-col" style="width:79.045%; border-right: 1px solid rgba(255,255,255,0.20);">
          <img class="rounded-lg" style="width: 100%;height: 100%; object-fit: cover;" :src="`https://cdn.cloudflare.steamstatic.com/steam/apps/${steamDetail.appinfo.appid}/header.jpg`" alt="">
          <span class="py-4">{{steamDetail.appinfo.common.name}}</span>
          <div></div>
        </div>
        <div class="pl-4" style="width:20%;">CPU信息</div>
      </div>
    </template>
    <!-- {{ steamDetail }} -->
  </div>
</template>

<script>
export default {
  name:'MySteamDetail',
  props:{
    steamDetail:{
      type:Object,
      default:()=>{}
    },
    cardSize:{
      type:Boolean,
      default:false
    }
  },   
  mounted() {
    console.log(this.steamDetail);
  },
}
</script>

<style lang="scss" scoped>

</style>