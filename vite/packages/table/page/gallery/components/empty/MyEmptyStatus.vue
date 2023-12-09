<template>
 <div class="flex items-center justify-center h-full flex-col">
  <EmptyIcon icon="fluent-emoji:framed-picture" style="font-size: 3.5rem;"/>
  <span class="xt-font xt-text font-14 my-6 font-400">我们提供了以下几种壁纸源供你选择，快快挑选喜爱的壁纸，加入收藏吧。</span>
  <div class="w-full flex items-center justify-center" >
    <xt-button  h="40"  v-for="item in emptyList" class="xt-bg-t-2 mr-3" style="border-radius: 10px;" @click="goDetail(item)">
      <div class="flex items-center justify-center">
        <MyIcon :icon="item.newIcon" style="font-size:1.25rem ;" class="mr-2"/>
        <span class="xt-font xt-text font-16 font-400">{{item.name}}</span>
      </div>
    </xt-button>
  </div>
 </div>
</template>

<script>
import { Icon as EmptyIcon } from '@iconify/vue';
import { galleryList } from '../../data/gallery';
export default {
  components:{
    EmptyIcon,
  },

  data(){
    return {
      emptyList:galleryList.list,
    }
  },

  methods:{
    goDetail(item){
      const hasRoute = item.hasOwnProperty('route');
      if(hasRoute){ this.$router.push(item.route)  }
      else { this.$emit('importLocal') }
    },
  },
}
</script>

<style lang="scss" scoped>

</style>