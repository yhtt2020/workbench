<template>
  <div  class="flex">
    <div v-for="item in fileList" style="width:338px;" class="mr-3 flex flex-col s-bg rounded-md">
      <ClipItem :clip="item"></ClipItem>
    </div>
  </div>
</template>

<script>
import ClipItem from '../../components/ClipItem.vue';
import { fileList } from '../../js/data/clipboardData'
export default {
  components:{
    ClipItem
  },
  data(){
    return{
      fileList
    }
  }
}
</script>

<style lang="scss" scoped>

</style>