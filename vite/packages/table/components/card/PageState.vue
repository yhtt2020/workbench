<template>
  <div class="flex flex-col justify-center items-center flex-1" v-if="false">

    <Icon icon="fluent-emoji:sleeping-face" width="56" height="56" />
    <div>功能在{{ platform }}端无法使用</div>
  </div>
  <slot v-else></slot>
</template>

<script setup>
import { ref, defineProps, computed } from 'vue';
import { Icon } from "@iconify/vue";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";
import {offlineStore} from '../../js/common/offline' 
import { mapActions, mapWritableState } from 'pinia'
const props = defineProps({
  env:{
    type:Object,
    default:{},
  }
})
const offline = offlineStore()
const offlineList = storeToRefs(offline).offlineList
onMounted(()=>{
  // console.log('props.env');
  // console.log(props.env);
})

const isOff = computed(() => {
  // if (window.$isOffline) {
  //   console.log(offlineList);
  //   console.log(offlineList.value);
  //   console.log(props);
  //   console.log(offlineList.value.indexOf(props.title));
  // }
  return window.$isOffline && offlineList.value.indexOf(props.title)
});

const platform = computed(()=>{
  if (window.$isOffline) {
    return '离线模式'
  }else if(window.$isWeb){
    return 'web端'
  }
  // return 
})
// const 
// })
// onMounted(()=>{
//   console.log('this');
//   console.log(cache.get('isOffline'));
// })
// const 

</script>

<style lang="scss" scoped></style>
