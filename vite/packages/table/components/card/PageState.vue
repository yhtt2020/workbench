<template>
  <div class="flex flex-col justify-center items-center flex-1" style="height:90%" v-if="isShow">
    <Icon icon="fluent-emoji:sleeping-face" width="56" height="56" />
    <div class="mt-4">功能在{{ platform }}无法使用</div>
  </div>
  <slot v-else></slot>
</template>

<script setup>
import { ref, defineProps, computed } from 'vue';
import { Icon } from "@iconify/vue";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";
const props = defineProps({
  env:{
    type:Object,
    default:{},
  }
})
onMounted(()=>{

})

const isShow = computed(() => {
  console.log(window.$currentEnv);
  // console.log( props.env[window.$currentEnv]);
  // console.log(props.env.offline);
  // props.env[window.$currentEnv]
  // props.env.offline
  // if (window.$isOffline) {
  //   console.log(offlineList);
  //   console.log(offlineList.value);
  //   console.log(props);
  //   console.log(offlineList.value.indexOf(props.title));
  // }
  return props.env[window.$currentEnv] || (props.env.offline && window.$isOffline)
});

const platform = computed(()=>{
  if (props.env.offline && window.$isOffline) {
    return '离线模式'
  }else if(props.env[window.$currentEnv] && window.$currentEnv=='web'){
    return 'web端'
  }else if(props.env[window.$currentEnv] && window.$currentEnv=='mobile'){
    return '移动端'
  }else if(props.env[window.$currentEnv] && window.$currentEnv=='client'){
    return '客户端'
  }
  return 
})

</script>

<style lang="scss" scoped></style>
