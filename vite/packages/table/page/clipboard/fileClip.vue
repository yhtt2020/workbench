<template>
  <div  class="flex">
    <div v-for="(item,index) in fileList" :key="index"  :class="{'active-clip':selectedIndex === index}"  class="mr-3 flex flex-col s-bg rounded-md">
      <ClipItem :clip="item" style="width:332px;height: 412px;"></ClipItem>
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
      fileList,
      selectedIndex:0,
    }
  },
  mounted(){
    window.addEventListener('keydown',this.listKeyDown)
  },
  methods:{
    // 键盘切换状态
    listKeyDown(e){
      const keyCode = e.keyCode
      if(keyCode === 37 && this.selectedIndex > 0){
        this.selectedIndex --
      }else if(keyCode === 39 && this.selectedIndex < this.fileList.length - 1){
        this.selectedIndex ++ 
      }
    }
  },
  beforeDestroy() {
    window.removeEventListener('keydown')
  },
}
</script>

<style lang="scss" scoped>
.active-clip{
  border: 6px solid rgba(80,139,254,1);
  &:deep(.clip-top){
    margin-bottom: 0 !important;
  }
  &:deep(.clip-text-center){
    padding-bottom: 28px !important;
  }
}
.s-bg{
  box-shadow:none !important;
}
</style>