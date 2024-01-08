<template>
 <xt-modal v-model="biliVideoVisible" :title="title" full ref="modelRef">
  <div :style="isFull ? {width:'100%',height:'100%'} : {width: '800px',height: '600px'}">
   <iframe :src="url" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" class="w-full h-full"></iframe>
  </div>
 </xt-modal>
</template>

<script setup>
import { ref,computed } from 'vue';

const biliVideoVisible = ref(false);
const title = ref('');
const modelRef = ref(null);
const url = ref('https://player.bilibili.com/player.html?aid=705765446&bvid=BV1tQ4y187G7&cid=1328305988&p=1');


const openBiliVideoPlay = (params) =>{
 biliVideoVisible.value = true;
 title.value = params.title
 url.value = params.url;
}

const isFull = computed(()=>{
  return modelRef.value.isFull;
})

defineExpose({
 openBiliVideoPlay
})

</script>

<style lang="scss" scoped>

</style>