<script setup lang="ts">

import {computed, ref, watch} from "vue";
import {clipboardStore} from '../store'
import {storeToRefs} from "pinia";
import ClipItem from "../components/ClipItem.vue";

const showRecent=ref(false)
const recentItem=ref({})
const {items}=storeToRefs(clipboardStore())
const {isNew,updateLastTime}=clipboardStore()
let timeout=null
watch(()=>items,(newValue)=>{
  console.log('变动了',items)
  if(!isNew(items.value[0]?.createTime)){
    return
  }
  updateLastTime(items.value[0]?.createTime)
  showRecent.value=true
  recentItem.value=items.value[0]
  if(timeout){
    clearTimeout(timeout)
  }
  timeout=setTimeout(()=>{
    showRecent.value=false
  },10000)
},{
  deep:true
})

</script>

<template>
  <teleport to="body">
    <transition>
    <div v-if="showRecent" style="position: fixed;left: 30px;top:50px;z-index: 102;">
      <div style="position: relative">
        <div style="position:absolute !important;right:5px;top:5px" >
          <xt-mix-icon class="" @click="showRecent=false" icon='fluent:dismiss-16-regular'/>
        </div>

        <div class="s-bg"  style="border-radius: 8px;overflow: hidden;background: var(--secondary-bg)">
          <ClipItem :clip-item="recentItem"></ClipItem>
        </div>

      </div>

    </div>
    </transition>
  </teleport>

</template>

<style scoped lang="scss">
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
