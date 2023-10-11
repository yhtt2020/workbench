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
    ...mapWritableState(keyStore, ['sessionList', 'executedApps', 'customApps']),
    hideApps() {
      return this.executedApps.filter(app => app.hide)
    }
  }, methods: {
    clearSessionList() {
      this.customApps = []
      this.executedApps = []
      this.sessionList = []
      message.success('清理会话列表成功')
      console.log('当前的会话', this.sessionList)
    }
  }
})
</script>

<template>
  <xt-button class="mb-2" @click="clearSessionList" type="theme">清空会话列表</xt-button>
  <div class="line-title">已经被隐藏的软件：</div>
  <ul class="hide-app-list w-full flex gap-2">
    <li v-for="app in hideApps">
      <div class="hide-app">
        <a-row :gutter="10">
          <a-col>
            <a-avatar :src="'file://'+app.software.icon" shape="square"></a-avatar>
          </a-col>
          <a-col>
            <div>{{ app.title }}</div>
            <div> {{ app.exeName }}</div>
          </a-col>
        </a-row>
      </div>
    </li>
  </ul>
</template>

<style scoped lang="scss">
.hide-app-list{
  list-style: none;
  padding-left: 20px;
}
.hide-app {
  border-radius: 4px;
  background: var(--secondary-bg);
  position: relative;
  padding: 10px;
  display: inline-block;
  margin-bottom: 10px;

}
</style>
