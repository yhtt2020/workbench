<template>
  <div class="main" >
    <div class="box-title flex justify-start align-center">
      <cloud-sync-outlined  class="box-icon" />
      <span class="text-title" style="margin-left: 10px">标签空间 </span>
    </div>
    <div class="box-content">
        未载入任何空间。
    </div>
  </div>
</template>


<script lang="ts">
import {
  CommentOutlined,
  CloudSyncOutlined
} from '@ant-design/icons-vue'

import { defineComponent } from 'vue'

export default defineComponent({
  components: {
    CommentOutlined,
    CloudSyncOutlined
  }
})


</script>


<style>

</style>
