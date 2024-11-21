<template>
 <div class="flex items-center justify-center h-full flex-col">
  <EmptyIcon icon="fluent-emoji:framed-picture" style="font-size: 3.5rem;"/>
  <span class="xt-font xt-text font-14 my-6 font-400">我们提供了以下几种壁纸源供你选择，快快挑选喜爱的壁纸，加入收藏吧。</span>
  <div class="w-full flex items-center justify-center" >
    <xt-button  h="40"  v-for="item in emptyList" class=" mr-3" :class="isModal ? 'xt-bg-2':'xt-bg-t-2'" style="border-radius: 10px;" @click="goDetail(item)">
      <div class="flex items-center justify-center">
        <xt-new-icon :icon="item.newIcon" :size="isModal ? 16 : 20" class="mr-2"></xt-new-icon>
        <span class="xt-font xt-text font-16 font-400">{{item.name}}</span>
      </div>
    </xt-button>
  </div>
 </div>
</template>

<script>
import { mapActions,mapWritableState} from "pinia";
import { Icon as EmptyIcon } from '@iconify/vue';
import { galleryList } from '../../data/gallery';
import { pickPaperStore } from "../../store/PickPaperStore";

export default {
  components:{
    EmptyIcon,
  },

  props:['isModal'],

  data(){
    return {
      // emptyList:galleryList.list,
    }
  },

  computed:{
    ...mapWritableState(pickPaperStore,["currentID"]),
    emptyList(){
      if(window.$usePlat("client")){
        return galleryList.list;
      }
      else {
        const newArr = galleryList.list.filter((list)=>{
          return  list.index !== 'i';
        })
        return newArr;
      }
    }
  },


  methods:{
    goDetail(item){
      if(item.index==='i'){
        this.$emit('importLocal')
        return
      }
      this.currentID = item.index;
      // if(this.isModal){
      //   if(item.index !== 'i'){
      //     this.$bus.emit('updatePage',item);
      //   }
      //   else {
      //     this.$emit('importLocal');
      //   }
      // }
      // else {
      //   const hasRoute = item.hasOwnProperty('route');
      //   if(hasRoute){ this.$router.push(item.route)  }
      //   else { this.$emit('importLocal') }
      // }
    },
  },
}
</script>

<style lang="scss" scoped>

</style>
