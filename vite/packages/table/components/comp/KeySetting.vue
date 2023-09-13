<script lang="ts">
import KeyInput from "./KeyInput.vue";
import {message} from "ant-design-vue";
import {taskStore}from "../../apps/task/store"
import { mapWritableState } from "pinia";
export default {
  name: "KeySetting",
  components: {KeyInput},
  data() {
    return {
      keys:{//默认键位
        table: {
          key:'alt+space',
          title:'工作台'
        },
        globalSearch: {
          key:'alt+f',
          title:'浏览器搜索'
        },
        superTools:{
          key:'alt+x',
          title:'超级工具箱'
        },
      },
      keyMap:{}//设置中取回的键位
    }
  },
  computed:{
    ...mapWritableState(taskStore, ["taskID", "step"]),
    m04013( ) {
      return this.taskID == "M0401" && this.step ==3
    }
  },
  async mounted() {
    this.refreshKeys()
  },
  methods: {
    getKeyMap(key) {
      if (this.keyMap[key]) {
        this.keys[key].key = this.keyMap[key]
      }
    },
    async refreshKeys() {
      this.keyMap = await tsbApi.settings.get('keyMap')
      Object.keys(this.keys).forEach(key => {
        this.getKeyMap(key)
      })
    },

    setKeyMap(event) {
      let rs = ipc.sendSync('setKeyMap', {key: event.key, shortcut: event.shortcut})
      if (rs) {
        this.refreshKeys()
        message.success('快捷键设置成功')
      } else {
        message.error('注册快捷键失败，可能是快捷键冲突，请更换快捷键重试。')
      }
    },
  }
}
</script>

<template>
  <xt-task :modelValue="m04013"></xt-task>
  <div v-for="key in Object.keys(this.keys)">
    <div class="line">
      {{this.keys[key].title}}快捷键
    </div>
    <div class="line">
      <key-input  :title=" this.keys[key].title" :name="key" :value="keys[key].key"
                  @changeKeys="setKeyMap"></key-input>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
