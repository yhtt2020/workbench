<script lang="ts" setup>
import { ref} from 'vue'
import HorizontalPanel from "../../components/HorizontalPanel.vue";
const defaultRecord=ref('desk')
const recordType=[
  {
    title:'桌面分享',
    name:'desk'
  }
]
</script>

<template>
  <div class="ml-4">
    <div style="width: 328px;" class="mb-3">
      <HorizontalPanel :navList="recordType" v-model:selectType="defaultRecord"></HorizontalPanel>
    </div>
    <div>

    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
