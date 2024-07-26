<script lang="ts" setup>
import  {onMounted, ref} from 'vue'
import {storeToRefs} from "pinia";
import {sharedDeskStore} from "../store/sharedDesk";
import { useRoute } from 'vue-router';
import Desk from '../components/desk/Desk.vue'
import SharedDesk from "./shared/sharedDesk.vue";
import shareHelper from "../js/lib/shareHelper";
const {currentDesk}= storeToRefs(sharedDeskStore())


const shareCode = ref('')
const sharedData=ref({})
const has=ref(true)
onMounted(() => {
  console.log('进入界面', useRoute().params)
  let {code,password} = useRoute().params
  if (code) {
    shareCode.value = code
    shareHelper.get(code,password).then(rs => {
      if (rs.status) {
        sharedData.value=rs.data
      }else{
        has.value=false
      }
    })
  }

})


</script>

<template>
  <SharedDesk v-if="has && Object.keys(sharedData).length>0" :share-code="shareCode" :shared-data="sharedData" ></SharedDesk>
  <div v-if="!has">
    404,桌面不存在
  </div>
</template>

<style lang="scss" scoped>

</style>
