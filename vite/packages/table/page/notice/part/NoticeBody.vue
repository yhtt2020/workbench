<script lang="ts">
import {defineComponent} from 'vue'
import {Image,ImagePreviewGroup} from 'ant-design-vue'
export default defineComponent({
  name: "NoticeBody",
  props:['content'],
  components:{Image,ImagePreviewGroup},
  data(){
    return {
    }
  },
  computed:{
    covers(){
      if(this.content.covers){
        return JSON.parse(this.content.covers)
      }else{
        return []
      }
    }
  },
  mounted() {
  },
  methods:{
    stop(){
      this.$emit('pause')
    }
  }
})
</script>

<template>
 <div class="flex flex-col gap-2">
   <div class="flex gap-2 previewer" style="display: flex">
     <ImagePreviewGroup >
      <Image style="aspect-ratio:16/9;object-fit:cover;"  @click="stop" v-for="cover in covers" :src="cover.cover"></Image>
     </ImagePreviewGroup>
   </div>
   <div>
     {{ content.body }}
   </div>
 </div>

</template>

<style scoped lang="scss">
.previewer :deep(.ant-image){
  flex:1;
  border-radius:10px;
  overflow: hidden;
}
</style>
