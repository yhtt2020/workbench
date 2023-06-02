<template>
  <div class="flex">
    <div v-for="item in imageList" style="width:338px;" class="mr-3 flex flex-col s-bg rounded-md">
      <div class="flex flex-col  rounded-t-md s-item px-5 py-3">
        <div class="flex items-center">
          <Icon :icon="item.icon" style="font-size: 1.5em;"></Icon>
          <span class="ml-2">{{item.title}}</span>
        </div>
        <div class="flex justify-between pt-1">
          <span class="">{{item.time}}</span>
          <span>{{item.capacity}}</span>
        </div>
      </div>
      <div style="padding: 46px 13px;width:299px;" class="flex-1">
        <div style="width:100%;height:185px;" class="rounded-lg flex flex-col" v-if="item.imgUrl">
          <img :src="item.imgUrl" alt="" class="rounded-lg" style="width: 100%;height: 100%;object-fit: cover;">
          <span class="py-5">{{ item.name }}</span>
        </div>
      </div>
      <div class="s-item h-12  rounded-b-md"> 
         
      </div>
    </div>
  </div> 
</template>

<script>
import { imageList} from '../../js/data/clipboardData'
export default {
  data(){
    return{
      imageList
    }
  } 
}
</script>

<style lang="scss" scoped>

</style>