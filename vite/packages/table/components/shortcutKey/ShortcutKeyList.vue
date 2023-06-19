<template>
    <!-- 快捷键列表 -->
  <div class="key-box" :style="keyBoxStyle">
    <template v-for="(item,i) in keyList" :key="item.type.tid" >
      <div class="key-item border-right" :class="showEdit ? 'key-back' : ''">
        <span>{{ item.type.title }}</span>
        <div class="key-edit" v-if="showEdit" @click="editItem(item.type,'title')">
          <Icon icon="bianji"></Icon>
          <span class="ml-2">编辑</span>
        </div>
      </div>
      <div v-for="(k,index) in item.data" :key="k.id" class="border-right key-item" :class="showEdit ? 'key-back' : ''"
      :style="keyIndex === k.id ? 'background: rgba(0,0,0,0.30);':''" @click="toggleKey(k.id)"
      >
        <div class="flex">
          <div v-for="i in k.keys" :key="i" class="flex">
            <span v-if="i.icon" class="s-bg h-8 w-8 flex items-center rounded-lg justify-center mr-3">
              <Icon :icon="i.icon" style="font-size: 1.5em;"></Icon>
            </span>
            <span v-else-if="i.key" class="s-bg h-8 w-8 flex items-center rounded-lg justify-center mr-3">{{ i.key }}</span>
          </div>
        </div>
        <div class="key-title">{{ k.title}}</div>
        <div class="key-edit" v-if="showEdit" @click="editItem(k,'item')">
          <Icon icon="bianji"></Icon>
          <span class="ml-2">编辑</span>
        </div>
      </div>
    </template>
    <div class="cover"></div>
  </div>
  <!-- 编辑名称 -->
  <a-drawer v-model:visible="openEdit" title="编辑" width="500" placement="right">
     <template #extra>
      <a-space>
        <div class="edit-btn" @click="saveVal">保存</div>
      </a-space>
    </template>
    <div v-if="editType === 'title'">
      <span class="edit-title">分组名称</span>
      <a-input v-model:value="editTitle" class="rounded-lg mt-6 drawer-item-bg" style="height: 48px" />
    </div>
    <div v-else-if="editType === 'item'">
      <span class="edit-title">组合键</span>
      <a-input :value="keyCombination" @keyup="showInfo" class="rounded-lg my-6 drawer-item-bg" style="height: 48px" />
      <span class="edit-title">操作名称</span>
      <a-input v-model:value="editName" class="rounded-lg mt-6 drawer-item-bg" style="height: 48px" />
    </div>
  </a-drawer>
</template>

<script>
import Sortable from 'sortablejs'

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
      // 编辑抽屉
      openEdit: false,
      // 编辑分组名称
      editTitle: '',
      // 编辑组合键
      keyCombination: '',
      // 编辑操作名称
      editName: '',
      // 当前编辑的元素索引
      editIndex: -1,
      // 编辑的类型
      editType: ''
    }
  },
  methods: {
    toggleKey(id){
      this.$emit('setKeyItem',id)
    },
    // 打开编辑抽屉
    editItem(item,type){
      switch (type) {
        case 'title':
          this.editTitle = item.title
          this.editIndex = item.tId
          this.editType = 'title'
          this.openEdit = true
          break;
        case 'item':
          this.editName = item.title
          this.editIndex = item.id
          this.editType = 'item'
          this.openEdit = true
          break;
      }
    },
    //关闭编辑抽屉保存输入的值
    saveVal(){
      if(this.editType === 'title'){
        // 保存修改分组名称
        this.keyList.forEach(item => {
          if(item.type.tId === this.editIndex) item.type.title = this.editTitle
        })
      }else if(this.editType === 'item'){
        // 保存修改的快捷键
        this.keyList.forEach(item => {
          item.data.forEach(i => {
            if(i.id === this.editIndex)i.title = this.editName
          })
        })
      }
      this.openEdit = false
    },
    //获取键盘按下的键
    showInfo(event){
      const str = event.key
      str.replace(/[^u4e00-u9fa5|,]+/ig, '')
      switch(event.key){
        case "Backspace":
          this.keyCombination = ''
          break;
        // 不需要的
        case "Tab":
        case " ":
        case "Process":
          break;
        default:
          if(this.keyCombination.indexOf(str.toUpperCase()) == -1){
            this.keyCombination.replace(/^\s/g, '')
            this.keyCombination += this.keyCombination ? (' + ' + str) : str
            this.keyCombination = this.keyCombination.toUpperCase()
          }
          break;
      }
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
    .key-edit{
      display: none;
      color: var(--active-bg);
    }
  }
  .key-back:hover{
    background: var(--primary-bg);
  }
  .key-back:hover .key-title{
    display: none;
  }
  .key-back:hover .key-edit{
    display: block;
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
  .edit-title{
    font-size: 16px;
    color: rgba(255,255,255,0.85);
    font-weight: 500;
  }
  .edit-btn{
    background: #2A2A2A;
    border-radius: 12px;
    width: 80px;
    height: 48px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
