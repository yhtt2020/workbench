<template>
 <div class="collapse">
  <div class="flex" @click="toggleCollapse">
   <span>{{title}}</span>
  </div>
  <div v-show="showContent">
   123
  </div>
 </div>
</template>

<script lang="ts">
import { defineComponent, reactive,toRefs } from 'vue'

export default defineComponent({
 props:['title'],

 setup () {
  const data = reactive({
   showContent:false
  })

  const toggleCollapse = () =>{
   data.showContent = !data.showContent
  }

  return {
   ...toRefs(data),
   toggleCollapse,
  }
 }
})
</script>

<style lang="scss" scoped>

</style>