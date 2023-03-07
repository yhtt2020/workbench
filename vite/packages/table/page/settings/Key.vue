<template>
  <div class="line-title">按键</div>

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

export default {
  name: 'Key',
  components: { KeyInput },
  data () {
    return {
      shortKeysTable: 'alt+space',
      shortKeysSearch: 'alt+f',
    }
  },
  methods: {
    setTableKeys (args) {
      this.shortKeysTable = args.keys
      console.log(args, '接收到按键改变事件')
    },
    setSearchKeys (args) {
      this.shortKeysSearch = args.keys
    },
  }
}
</script>

<style scoped>

</style>
