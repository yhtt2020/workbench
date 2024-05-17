<script lang="ts" setup>
import  {onMounted, ref} from 'vue'
import {storeToRefs} from "pinia";
import {sharedDeskStore} from "../store/sharedDesk";
import { useRoute } from 'vue-router';
import Desk from '../components/desk/Desk.vue'
const {currentDesk}= storeToRefs(sharedDeskStore())


const deskId = ref('')
const deskData=ref({})
onMounted(() => {
  console.log('进入界面', useRoute().params?.id)
  let id = useRoute().params?.id
  if (id) {
    deskId.value = id
    sharedDeskStore().getDeskInfo(id).then(rs => {
      if (rs.status) {
        currentDesk.value = rs.data
        deskData.value=JSON.parse(currentDesk.value.data?.template)
      }else{

      }
    })
  }

})


</script>

<template>
  当前桌面：{{ deskId }} {{deskData}}
  <Desk :key="deskId" :current-desk="deskData" :settings="currentDesk.settings">

  </Desk>
  {{ deskData }}
  <div v-if="!deskData">
    404,桌面不存在
  </div>
</template>

<style lang="scss" scoped>

</style>
