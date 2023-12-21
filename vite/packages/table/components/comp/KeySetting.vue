<script lang="ts">
import KeyInput from "./KeyInput.vue";
import {message} from "ant-design-vue";
import {taskStore}from "../../apps/task/store"
import { mapWritableState } from "pinia";
import { Icon } from '@iconify/vue';
import KeyBoard from './KeyBoard.vue'
import { nanoid } from 'nanoid'
import {keyCutStore}from "./keyCut"
export default {
  name: "KeySetting",
  components: {KeyInput, Icon, KeyBoard},
  props:['isGuide'],
  data() {
    return {
      keyMap:{}, //设置中取回的键位
      keyBoard: false,
      selectKey: {
        id: nanoid(),
        keys: [],
        keyStr: '',
        keyArr: [],
        title: '',
        isEdit: false,
        // addInputIndex: item
      }, 
      //选中的快捷键
      keyList:[],
      type:''

    }
  },
  computed:{
    ...mapWritableState(taskStore, ["taskID", "step"]),
    ...mapWritableState(keyCutStore, ["keys"]),
    m04012( ) {
      return this.taskID == "M0401" && this.step == 2
    }
  },
  async mounted() {
    this.refreshKeys()
  },
  methods: {
    closeKeyBoard(){
      this.keyBoard = false
    },
    // 保存修改的快捷键
    saveKey (keyArr) {
      this.keyBoard = false
      this.keyList.forEach((item, index) => {
        if (item.id === keyArr.id) {
          if (keyArr.title && !this.bulkEditKey) {
            keyArr.isEdit = false
            keyArr.isNote = false
          }
          this.keyList.splice(index, 1, keyArr)
          this.keyContent = keyArr.keyStr
        }
        if (item.keyStr === '' || item.title === '') {
          item.isEdit = true
          item.isNote = true
        }
      })
    },
    setKey(key, type){
      this.selectKey = key
      this.type = type
      this.keyBoard = true
    },
    getKeyMap(key) {
      if (this.keyMap[key]) {
        this.keys[key].key = this.keyMap[key].split('+')
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
  <xt-task :modelValue="m04012"></xt-task>
  <div v-if="isGuide" class="w-full">
    <div v-for="key in Object.keys(this.keys)" @click="setKey(keys[key], key)" class="xt-bg-2 rounded-lg mt-3 pointer" style="padding:12px 16px;">
      <div class="flex justify-between">
        <div class="flex xt-text">
          {{ this.keys[key].title }}快捷键：
          <div v-for="item in keys[key].keys? keys[key].keys: keys[key].key">
            <span class="xt-bg rounded-lg ml-2" style="padding: 6px 12px;">{{ item }}</span>
          </div>
        </div>
        <span class="xt-text-2 font-14 flex items-center">修改 &nbsp;<Icon icon="fluent:chevron-right-16-regular" /></span>
      </div>
    </div>
  </div>
  <!-- 键盘 -->
  
  <!-- v-if="keyBoard" -->

  <div v-else>
    <div v-for="key in Object.keys(this.keys)">
      <div class="line">
        {{this.keys[key].title}}快捷键
      </div>
      <div class="line">
        <key-input  :title=" this.keys[key].title" :name="key" :value="keys[key].key.join(' + ')"
        @changeKeys="setKeyMap"></key-input>
      </div>
    </div>
  </div>
  
  <!-- v-if="true" -->
  
  <KeyBoard 
    v-if="keyBoard"
    :selectKey="selectKey"
    :parentKeyList="keyList"
    :type="type"
    :refreshKeys="refreshKeys"
    @closeKeyBoard="closeKeyBoard"
    @saveKey="saveKey"
    >
  </KeyBoard>
</template>

<style scoped lang="scss">

</style>
