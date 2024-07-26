<script lang="ts" setup>
import Desk from "../../components/desk/Desk.vue";
import {computed, defineProps, onMounted, ref, toRef, toRefs, watch} from 'vue'
import {appStore} from '../../store'
const props = defineProps({
  shareCode: {
    type: String,
  },
  sharedData: {
    type: Object
    , default: () => ({})
  }
})
const {userInfo}=toRefs(appStore)
const desk = ref({})
onMounted(() => {
  try {
    desk.value = JSON.parse(JSON.parse(props.sharedData.data))
    console.log( desk.value, 'shareddata')
  } catch (e) {
    console.error(e)
  }


})

const deskSettings=computed(()=>{
  const settings=desk.value.settings
  settings.cardMargin=settings.cardMargin||6
  settings.cardZoom=settings.cardZoom||100
  return settings
})

</script>

<template>
  <div class="p-4"  v-if="Object.keys(desk).length>0" >
    <Desk  :freeLayout="false"   v-if="Object.keys(desk).length>0" :key="shareCode"   :settings="deskSettings" :current-desk="desk" :editing="false">
    </Desk>
    <div v-if="sharedData.uid===userInfo?.uid">
      操作面板
    </div>
  </div>



<!--  <Desk-->
<!--    :muuriOptions="muuriOptions"-->
<!--    :freeLayout="false"-->
<!--    :currentDesk="displayScheme"-->
<!--    :settings="displayScheme.settings"-->
<!--    :notTrigger="true"-->
<!--    :editing="false"-->
<!--  ></Desk>-->
</template>

<style scoped lang="scss">

</style>
