<template>
  <div class="flex">
    <div class="flex items-center justify-center w-full" v-if="clipList.length === 0">
      <div class="flex items-center justify-center"  >
        <a-empty :image="simpleImage"/>
      </div>
    </div>
    <div v-else v-for="item in clipList" class="mr-3 flex flex-col s-bg rounded-lg" >
      <ClipItem :clip="item"></ClipItem>
    </div>
  </div>
</template>

<script>
import ClipItem from '../../components/clipPreview/ClipItem.vue';
import { Empty } from 'ant-design-vue';
export default {
  components:{
    ClipItem
  },
  props:{
    clipList:{
      type:Array,
      default:()=>[]
    }
  },
  data(){
    return{
      simpleImage: '/public/img/test/not-data.png',
    }
  },
}
</script>

<style lang="scss" scoped>
.s-bg{
  box-shadow: none !important;
}
</style>