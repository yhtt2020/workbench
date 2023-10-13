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
    ...mapWritableState(keyStore, ['sessionList', 'executedApps', 'customApps','recentlyUsedList']),
    hideApps() {
      return this.executedApps.filter(app => app.hide)
    }
  }, methods: {
    clearSessionList() {
      this.customApps = []
      this.executedApps = []
      this.sessionList = []
      this.recentlyUsedList=[]
      message.success('清理会话列表成功')
      console.log('当前的会话', this.sessionList)
    },
    enterEdit(app){
      this.$router.push({
        name:'editApp',
        params:{
          'exeName':app.exeName
        }
      })
    }
  }
})
</script>

<template>
  <h3>快捷键设置</h3>
  <div class="p-4">
    <xt-button class="mb-5" @click="clearSessionList" type="theme">清空会话列表</xt-button>
    <div class="line-title">已经被隐藏的软件：</div>
    <div class="pl-2" v-if="hideApps.length===0">暂无被隐藏的软件，您可以在软件设置中隐藏不需要的软件。</div>
    <ul class="hide-app-list w-full flex gap-2">
      <li class="pointer " v-for="app in hideApps" @click="enterEdit(app)">
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
  </div>

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
