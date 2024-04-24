<!-- 3D模型组件 -->
<script setup>
import * as  OV from "online-3d-viewer";
import { onMounted, ref, toRefs  } from "vue";

const props = defineProps({
 data:{
  type:Object,
  default:()=>{}
 }
});
const { data } = toRefs(props);

onMounted(()=>{
 OV.SetExternalLibLocation()
})
</script>

<template>
  <div></div>
</template>

<style lang="scss" scoped>
</style>