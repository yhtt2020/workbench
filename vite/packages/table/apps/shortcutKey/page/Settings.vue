<script lang="ts">
import {defineComponent} from 'vue'
import XtButton from "../../../ui/libs/Button/index.vue";
import {mapWritableState} from "pinia";
import {keyStore} from "../store";
import {message} from "ant-design-vue";

export default defineComponent({
  name: "Settings",
  components: {XtButton},
  computed: {
    ...mapWritableState(keyStore, ['sessionList','executedApps','customApps'])
  }, methods: {
    clearSessionList() {
      this.customApps=[]
      this.executedApps=[]
      this.sessionList = []
      message.success('清理会话列表成功')
      console.log('当前的会话',this.sessionList)
    }
  }
})
</script>

<template>
  <xt-button @click="clearSessionList" type="theme">清空会话列表</xt-button>
</template>

<style scoped lang="scss">

</style>
