<template>
  <div class="main" >
    <div class="title flex justify-start align-center">
      <comment-outlined  style="color: #F5F5F5;fontSize:22px;margin-left: 10px"/>
      <span class="text-title" style="margin-left: 10px">标签空间状态： xx</span>
    </div>
    <div class="content-small">

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
