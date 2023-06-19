<template>
    <!-- 快捷键列表 -->
  <div class="key-box" :style="keyBoxStyle" id="keyBox">
    <div v-for="(item,i) in keyList" :key="item.id">
      <!-- 分组名称 -->
      <div class="key-item border-right" :class="showEdit ? 'key-back' : ''" v-if="item.groupName">
        <span>{{ item.groupName }}</span>
        <div class="key-edit" v-if="showEdit" @click="editItem(item,'title')">
          <Icon icon="bianji"></Icon>
          <span class="ml-2">编辑</span>
        </div>
      </div>
      <!-- 快捷键 -->
      <div v-else class="border-right key-item" :class="showEdit ? 'key-back' : ''"
      :style="!showEdit ? (keyIndex === item.id ? 'background: rgba(0,0,0,0.30);':'') : ''" @click="toggleKey(item.id)"
      >
        <div class="flex">
          <div v-for="i in item.keys" :key="i" class="flex">
            <span v-if="i.icon" class="s-bg h-8 w-8 flex items-center rounded-lg justify-center mr-3">
              <Icon :icon="i.icon" style="font-size: 1.5em;"></Icon>
            </span>
            <span v-else-if="i.key" style="padding:0 10px;" class="s-bg h-8 flex items-center rounded-lg justify-center mr-3">{{ i.key }}</span>
          </div>
        </div>
        <div class="key-title">{{ item.title}}</div>
        <div class="key-edit" v-if="showEdit" @click="editItem(item,'item')">
          <Icon icon="bianji"></Icon>
          <span class="ml-2">编辑</span>
        </div>
      </div>
    </div>
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
      <a-input :value="keyCombination" @keydown="showInfo" class="rounded-lg my-6 drawer-item-bg" style="height: 48px" />
      <span class="edit-title">操作名称</span>
      <a-input v-model:value="editName" class="rounded-lg mt-6 drawer-item-bg" style="height: 48px" />
    </div>
  </a-drawer>
</template>

<script>
import Sortable from 'sortablejs'
import { message } from 'ant-design-vue';
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
      // 输入的组合键
      inputKeyArr: [],
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
          this.editTitle = item.groupName.trim()
          this.editIndex = item.id
          this.editType = 'title'
          this.openEdit = true
          break;
        case 'item':
          let arr = item.keys.map(i => {
            return i.key || i.icon
          })
          let str = arr.join(' + ')
          this.keyCombination = str
          this.editName = item.title.trim()
          this.editIndex = item.id
          this.editType = 'item'
          this.openEdit = true
          break;
      }
    },
    //关闭编辑抽屉保存输入的值
    saveVal(){
      if(this.editType === 'title'){
        if(!this.editTitle.trim())return message.info('分组名称不能为空');
        // 保存修改分组名称
        this.keyList.forEach(item => {
          if(item.id === this.editIndex) item.groupName = this.editTitle
        })
      }else if(this.editType === 'item'){
        if(!this.keyCombination || !this.editName.trim())return message.info('组合键或名称不能为空');
        // 保存修改的快捷键
        this.keyList.forEach(item => {
            if(item.id === this.editIndex){
              let keyArr = this.keyCombination.split(' + ')
              keyArr.forEach((item,index) => {
                keyArr.splice(index,1,{key: item})
              })
              item.keys = keyArr
              item.title = this.editName
            }
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
          this.inputKeyArr = []
          break;
        // 不需要的
        case "Tab":
        case " ":
        case "Process":
          break;
        default:
          //去重
          if(this.keyCombination.indexOf(str.toUpperCase()) == -1){
            this.keyCombination.replace(/^\s/g, '')
            this.inputKeyArr.push(str)
            if(this.inputKeyArr.length < 4){
              this.keyCombination += this.keyCombination ? (' + ' + str) : str
              this.keyCombination = this.keyCombination.toUpperCase()
            }
          }
          break;
      }
    },
    //拖拽排序
    keyDrop(){
      let that = this;
      let side = document.getElementById('keyBox')
      Sortable.create(side, {
        sort: true,
        animation: 150,
        onUpdate:function(event){
          let newIndex = event.newIndex,
            oldIndex = event.oldIndex
          let  newItem = side.children[newIndex]
          let  oldItem = side.children[oldIndex]
          // 先删除移动的节点
          side.removeChild(newItem)
          // 再插入移动的节点到原有节点，还原了移动的操作
          if(newIndex > oldIndex) {
            side.insertBefore(newItem,oldItem)
          } else {
            side.insertBefore(newItem,oldItem.nextSibling)
          }
          let temp = that.keyList[oldIndex]
          that.keyList.splice(oldIndex, 1)
          that.keyList.splice(newIndex, 0, temp)
        }
      });
    },
  },
  mounted(){
    if(this.showEdit){
      this.$nextTick(() => {
      this.keyDrop()
    })
    }
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
