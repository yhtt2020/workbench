<template>
  <div class="mb-6">
    <transition name="fade">
      <div class="flex flex-col" id="aggregate-drop" ref="aggDropRef">
        <div v-for="item in drawerList" class="flex items-center cursor-move agg-set mb-4 p-3 rounded-xl" :data-index="item.id">
          <div class="flex items-center cursor-move search-engine" style="width: 40%;">
             <HolderOutlined style="font-size: 20px;"></HolderOutlined>
          </div>
          <div class="flex items-center">
            <div class="flex items-center justify-center mr-2">
              <Icon :icon="item.icon" style="font-size: 1.75em;" :style="item.icon === 'bing' ? {color:'rgba(82,196,26, 1)'} : {}">
              </Icon>
            </div>
            <span>{{ item.title }}</span>
          </div>
        </div>
      </div>
    </transition>
  </div>

</template>

<script>
import Sortable from 'sortablejs';
export default {
  props:{
    drawerList:{
      type:Object,
      default:()=>[]
    }
  },
  mounted(){
    const el = this.$refs.aggDropRef
    new Sortable(el,{
      group: 'sortableGroup',
      onEnd: this.onSortEnd // 拖拽结束时触发的回调函数
    })
  },
  methods:{

    onSortEnd(evt){
      let newIndex = evt.newIndex , oldIndex = evt.oldIndex
      let newItem = this.$refs.aggDropRef.children[newIndex]
      let oldItem = this.$refs.aggDropRef.children[oldIndex]
      // 先删除移动的节点
      this.$refs.aggDropRef.removeChild(newItem)
      // 再插入移动的节点到原有节点，还原了移动的操作
      if (newIndex > oldIndex) {
        this.$refs.aggDropRef.insertBefore(newItem, oldItem)
      } else {
        this.$refs.aggDropRef.insertBefore(newItem, oldItem.nextSibling)
      }
      // 将数组进行排序
      let cloneTemp = [...this.drawerList]  // 将父组件传入的数据进行克隆
      let temp = cloneTemp[evt.oldIndex]  // 获取旧的下标
      cloneTemp.splice(evt.oldIndex, 1)   // 移除旧的下标
      cloneTemp.splice(evt.newIndex, 0, temp) // 将旧的下标进行替换
      this.$emit('setSortedList',cloneTemp)  // 将替换后数据进行回传
    }

  }


}
</script>

<style lang="scss" scoped>
.primary-title{

  font-size: 16px;
  font-weight: 500;
}
.secondary-title{

  font-size: 16px;
  font-weight: 400;
}
.agg-set{
  background: var(--secondary-bg);
}

:deep(.nav-item){
  width: 50% !important;
  border-radius: 8px !important;
}

:deep(.ps__rail-y){
  display: none !important;
}
</style>
