<script lang="ts">
import {defineComponent} from 'vue'
import {Image} from 'ant-design-vue'
export default defineComponent({
  name: "NoticeBody",
  props:['content'],
  components:{Image},
  data(){
    return {
      covers:[]
    }
  },
  mounted() {
    if(this.content.covers){
      this.covers=JSON.parse(this.content.covers)
    }else{
      this.covers=[]
    }
  }
})
</script>

<template>
 <div class="flex flex-col gap-2">
   <div class="flex gap-2 ">
     <Image v-for="cover in covers" :src="cover.cover"></Image>
   </div>
   <div>
     {{ content.body }}
   </div>
 </div>

</template>

<style scoped lang="scss">

</style>
