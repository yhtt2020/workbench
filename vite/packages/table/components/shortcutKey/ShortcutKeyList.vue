<template>
  <!-- 快捷键列表 -->
  <div class="key-box" :style="keyBoxStyle" id="keyBox">
    <div v-for="(item,index) in keyList" :key="item.id">
      <!-- 分组名称 -->
      <div class="key-item border-right" v-if="item.groupName">
        <span class="truncate">{{ item.groupName }}</span>
      </div>
      <!-- 快捷键 -->
      <div v-else class="border-right key-item" :style="keyIndex === item.id ? 'background: rgba(0,0,0,0.30);':''" @click="toggleKey(item.id)">
        <div class="flex">
          <div v-for="i in item.keys" :key="i" class="flex">
            <span style="padding:0 10px;" class="s-bg h-8 flex items-center rounded-lg justify-center mr-3">{{ i }}</span>
          </div>
        </div>
        <div class="key-title truncate">{{ item.title}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ShortcutKeyList",
  props: {
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
  data() {
    return {
    }
  },
  methods: {
    toggleKey(id){
      this.$emit('setKeyItem',id)
    },
  },
  mounted(){
  },
}
</script>
<style lang="scss" scoped>
  .key-box{
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    align-content: flex-start;
    overflow: auto;
    padding: 24px 0; 
    flex-wrap: wrap;
    height: 100%;
    width: 100%;
    
  }
  .key-box::-webkit-scrollbar{
    display: none;
  }
  .key-item{
    padding: 0 12px;
    margin: 0 20px 8px;
    width: 350px;
    height:48px;
    line-height:48px;
    font-size: 16px;
    color: rgba(255,255,255,0.85);
    display: flex;
    border-radius: 8px;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
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
    border-right: solid rgba(255, 245, 245, 0.1) 1px;
  }
  .s-bg{
    box-shadow: none !important;
  }  
  .key-title{
    flex: 1;
    max-width: 160px;
    text-align: right;
  }
</style>
