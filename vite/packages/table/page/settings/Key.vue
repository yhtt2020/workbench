<template>
  <div class="line-title">按键设置</div>

  <div style="text-align: left">
    <div v-for="key in Object.keys(this.keys)">
      <div class="line">
        {{this.keys[key].title}}快捷键
      </div>
      <div class="line">
        <key-input  :title=" this.keys[key].title" :name="key" :value="keys[key].key"
                   @changeKeys="setKeyMap"></key-input>
      </div>
    </div>
<!--    <div class="line">-->
<!--      呼出/隐藏工作台快捷键-->
<!--    </div>-->
<!--    <div class="line">-->
<!--      <key-input placeholder="呼出/隐藏工作台快捷键" title="工作台" name="table" :value="keys.table.key"-->
<!--        @changeKeys="setTableKeys"></key-input>-->
<!--    </div>-->
<!--    <div class="line">-->
<!--      呼出/隐藏全局搜索快捷键-->
<!--    </div>-->
<!--    <div class="line">-->
<!--      <key-input placeholder="呼出/隐藏全局搜索快捷键" title="全局搜索" name="search" :value="keys.globalSearch.key"-->
<!--        @changeKeys="setSearchKeys"></key-input>-->
<!--    </div>-->
<!--    <div class="line">-->
<!--      呼出/隐藏超级工具箱快捷键-->
<!--    </div>-->
<!--    <div class="line">-->
<!--      <key-input placeholder="呼出/隐藏超级工具箱快捷键" title="超级工具箱" name="search" :value="keys.superTools.key"-->
<!--                 @changeKeys="setKey"></key-input>-->
<!--    </div>-->
  </div>
</template>

<script>
import KeyInput from '../../components/comp/KeyInput.vue'
import { message } from 'ant-design-vue'
export default {
  name: 'Key',
  components: { KeyInput },
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
  async mounted() {
   this.refreshKeys()
  },
  methods: {
    getKeyMap(key){
      if(this.keyMap[key]){
        this.keys[key].key = this.keyMap[key]
      }
    },
    async refreshKeys () {
      this.keyMap = await tsbApi.settings.get('keyMap')
      Object.keys(this.keys).forEach(key => {
        this.getKeyMap(key)
      })
    },

    setKeyMap(event){
      console.log('发送消息出去',event.key,event.shortcut)
      let rs=ipc.sendSync('setKeyMap', {key:event.key, shortcut:event.shortcut })
      if(rs){
        this.refreshKeys()
        message.success('快捷键设置成功')
      }else{
        message.error('注册快捷键失败，可能是快捷键冲突，请更换快捷键重试。')
      }
    },

    // setTableKeys(args) {
    //
    //   let rs = ipc.sendSync('setTableShortcut', { shortcut: args.keys })
    //   if (!rs) {
    //     message.error('设置快捷键失败，请更换快捷键')
    //     return
    //   } else {
    //     message.success('快捷键设置成功')
    //     this.shortKeysTable = args.keys
    //   }
    //   this.refreshKeys()
    // },
    // setSearchKeys(args) {
    //   ipc.sendSync('setGlobalShortcut', { shortcut: args.keys })
    //   if (!rs) {
    //     message.error('设置快捷键失败，请更换快捷键')
    //     return
    //   } else {
    //     message.success('快捷键设置成功')
    //     this.shortKeysSearch = args.keys
    //   }
    //   this.refreshKeys()
    },
    setKey(input){

    }
  }
}
</script>

<style scoped lang="scss">
</style>
