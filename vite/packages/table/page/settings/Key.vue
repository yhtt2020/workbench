<template>
  <div class="line-title">按键设置</div>

  <div style="text-align: left">
    <div class="line">
      呼出/隐藏工作台快捷键
    </div>
    <div class="line">
      <key-input placeholder="呼出/隐藏工作台快捷键" title="工作台" name="table" :value="shortKeysTable"
                 @changeKeys="setTableKeys"></key-input>
    </div>
    <div class="line">
      呼出/隐藏全局搜索快捷键
    </div>
    <div class="line">
      <key-input placeholder="呼出/隐藏全局搜索快捷键" title="全局搜索" name="search" :value="shortKeysSearch"
                 @changeKeys="setSearchKeys"></key-input>
    </div>
  </div>

</template>

<script>
import KeyInput from '../../components/comp/KeyInput.vue'
import {message}from 'ant-design-vue'
export default {
  name: 'Key',
  components: { KeyInput },
  data () {
    return {
      shortKeysTable: 'alt+space',
      shortKeysSearch: 'alt+f',
    }
  },
  async mounted () {
    let keyMap = await tsbApi.settings.get('keyMap')
    if (keyMap.table) {
      this.shortKeysTable = keyMap.table
    }
    if (keyMap.globalSearch) {
      this.shortKeysSearch = keyMap.globalSearch
    }
  },
  methods: {
    setTableKeys (args) {

      let rs=ipc.sendSync('setTableShortcut',{shortcut:args.keys})
      if(!rs){
        message.error('设置快捷键失败，请更换快捷键')
        return
      }else{
        message.success('快捷键设置成功')
        this.shortKeysTable = args.keys
      }
    },
    setSearchKeys (args) {

      let rs=ipc.sendSync('setGlobalShortcut',{shortcut:args.keys})
      if(!rs){
        message.error('设置快捷键失败，请更换快捷键')
        return
      }else{
        message.success('快捷键设置成功')
        this.shortKeysSearch = args.keys
      }

    },
  }
}
</script>

<style scoped>

</style>
