<template>
  <!-- 快捷键列表 -->
  <vue-custom-scrollbar :settings="settingsScroller" style="width:100%;height:100%;border-radius: 12px;"
                        :style="keyBoxStyle">
    <div class="key-box" id="keyBox">
      <div v-for="(item,index) in keyList" :key="item.id">
        <!-- 分组名称 -->
        <div class="key-item border-right" v-if="item.groupName">
          <span class="truncate"><div class="color-dot" :style="{backgroundColor:getColor(keyList,index)}"></div>  {{
              item.groupName
            }}</span>
        </div>
        <!-- 快捷键 -->
        <div  v-else :class="{pointer:!noClick}" class="border-right key-item " :style="{backgroundColor:getColor(keyList,index)}"
             @click="clickKey(item.id)">
          <div class="flex">
            <div v-for="i in item.keys" :key="i" class="flex">
              <span style="min-width:32px;padding:0 8px;"
                    class="xt-bg-2 xt-text h-8 flex items-center rounded-lg justify-center mr-3">{{ i }}</span>
            </div>
          </div>
          <div class="key-title truncate">{{ item.title }}</div>
          <div v-if="item.addNote" class="text-note">
            <span class="note-val">{{ item.noteVal }}</span>
          </div>
        </div>
      </div>
    </div>
  </vue-custom-scrollbar>
</template>

<script>
import { getColor } from '../lib/lib'
import * as shorcutTools from '../shortcutTools'

export default {
  name: 'ShortcutKeyList',
  props: {
    noClick:{
      //无法被点击
      type:Boolean,
      default:false
    },
    // 快捷键列表
    keyList: {
      type: Array,
      default: []
    },
    // 选中的索引
    keyIndex: {
      type: Number,
      default: 0
    },
    // 列表样式
    keyBoxStyle: {
      type: Object,
      default: () => {}
    },
    //是否显示编辑
    showEdit: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      settingsScroller: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: true,
        suppressScrollX: false,
        wheelPropagation: true
      }
    }
  },
  methods: {
    getColor,
    clickKey (item) {
      if(this.noClick){
        return
      }
      shorcutTools.doKey(item)
      this.$emit('setKeyItem', item.id)
    },
  },
  mounted () {
  },
}
</script>
<style lang="scss" scoped>
.key-box {
  display: flex;
  flex-direction: column;
  align-content: flex-start;
  // overflow: auto;
  padding: 24px 0;
  flex-wrap: wrap;
  height: 100%;
  width: 100%;

}

.key-box::-webkit-scrollbar {
  display: none;
}

.key-item {
  padding: 0 12px;
  margin: 0 20px 8px;
  width: 350px;
  height: 48px;
  line-height: 48px;
  font-size: 16px;
  color: var(--primary-text);
  display: flex;
  border-radius: 8px;
  justify-content: space-between;
  align-items: center;
  border-radius: 8px;
}

.border-right {
  position: relative;
}

.border-right::after {
  content: '';
  position: absolute;
  right: -20px;
  top: 0;
  height: 56px;
  margin-left: 10px;
  border-right: solid var(--divider) 1px;
}

.key-title {
  flex: 1;
  max-width: 160px;
  text-align: right;
  color: var(--primary-text);
}


.text-note {
  margin: 0 20px 8px;
  padding: 0 12px;
  width: 350px;
  height: 22px;
  text-align: right;
  position: relative;
}

.note-val {
  position: relative;
  top: -14px;
  font-size: 16px;
  color: var(--secondary-text);
}

.text-note::after {
  content: '';
  position: absolute;
  right: -20px;
  top: 0;
  height: 30px;
  margin-left: 10px;
  border-right: solid rgba(255, 255, 255, 0.1) 1px;
}

</style>
