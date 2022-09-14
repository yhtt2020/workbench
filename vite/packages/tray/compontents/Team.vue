<template>
<div class="main" >
  <div class="title flex justify-start align-center">
      <comment-outlined  style="color: #F5F5F5;fontSize:22px;margin-left: 10px"/>
      <span class="text-title" style="margin-left: 10px">轻聊</span>
  </div>
  <div class="content-big flex flex-direction">
    <div style="width: 100%;height: 90px">

    </div>
    <div style="width: 100%;text-align: center">
      <span class="text-content-b">打开轻聊查看</span>
    </div>
  </div>
</div>
</template>

<script lang="ts">
import {
  CommentOutlined
} from '@ant-design/icons-vue'

import { defineComponent } from 'vue'

export default defineComponent({
  components: {
    CommentOutlined
  }
})


</script>

<style>

</style>
