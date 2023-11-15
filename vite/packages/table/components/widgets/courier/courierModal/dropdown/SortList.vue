<template>
  <div class="flex flex-col flex-1 h-0" @click="getColor">
    <div   class="flex items-center justify-between px-4 py-3 mb-3 rounded-lg h-11 xt-bg-2">
      <span class="xt-text-2 font-14 font-400">「全部」分类下支持拖拽排序。</span>
      <xt-button w="12" h="12" @click="settings.tagVisible = false">
        <div class="flex items-center justify-center">
          <SmallIcon icon="fluent:dismiss-16-filled" style="font-size: 1.25rem;"/>
        </div>
      </xt-button>
    </div>
    <vue-custom-scrollbar class="flex-1 h-0" :settings="settingsScroller">
      <div  ref="dropRef" class="w-full">
        <ListItem @afterRemove="scrollToItem(currentDetail._id)" @scrollToCurrent="scrollToItem(currentDetail._id)" :ref="el=>setItemRef(el,item)" :item="item" @goDetail="seeDetail(item)" v-for="item in list"></ListItem>
        <div style="height: 12px;"></div>
      </div>
    </vue-custom-scrollbar>
  </div>
</template>

<script>
import { mapActions, mapWritableState } from 'pinia'
import { Icon as SmallIcon } from '@iconify/vue'
import Sortable from 'sortablejs'
import { kdCompany, kdState, switchColor, convertJdStatusColor } from '../../mock'
import { courierStore } from '../../../../../apps/ecommerce/courier'
import { appStore } from '../../../../../store'
import Cover from '../../component/Cover.vue'
import ListItem from '../../ListItem.vue'

export default {
  props: ['list', 'sortItem'],

  components: {
    ListItem,
    Cover,
    SmallIcon
  },

  data () {
    return {
      itemRefs:[],
      settingsScroller: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true
      },
    }
  },

  computed: {
    ...mapWritableState(appStore, ['settings']),
    ...mapWritableState(courierStore, ['currentDetail']),
  },

  mounted () {
    this.scrollToItem(this.currentDetail._id)
    //this.currentID = this.list[0].LogisticCode
  },

  watch: {
    'list': {
      handler () {
        this.refreshData()
      },
      immediate: true
    }
  },

  methods: {
    ...mapActions(courierStore, ['removeDbData', 'putSortList', 'followCourier', 'unfollowCourier']),
    scrollToItem(id){
      setTimeout(() => {
        let found = this.itemRefs.find(item => {
          return item.id === id
        })
        if (found) {
          found.el.$el.scrollIntoView()
          setTimeout(()=>{
            found.el.$el.firstElementChild.style.border='solid var(--active-bg) 2px'
            setTimeout(()=>{
              found.el.$el.firstElementChild.style.border=''
            },400)
          },400)

        }
      },500)
    },
    setItemRef(el,item){
      this.itemRefs.push({
        el:el,
        id:item._id
      })
    },
    refreshData () {

      this.$nextTick(() => {
        const el = this.$refs.dropRef
        new Sortable(el, {
          group: 'sortableGroup',
          onEnd: this.onSortEnd // 拖拽结束时触发的回调函数
        })
      })
    },
    onSortEnd (evt) {
      let newIndex = evt.newIndex, oldIndex = evt.oldIndex
      const dropRef = this.$refs.dropRef
      let newItem = dropRef.children[newIndex]
      let oldItem = dropRef.children[oldIndex]
      // 先删除移动的节点
      dropRef.removeChild(newItem)
      // 再插入移动的节点到原有节点，还原了移动的操作
      if (newIndex > oldIndex) {
        dropRef.insertBefore(newItem, oldItem)
      } else {
        dropRef.insertBefore(newItem, oldItem.nextSibling)
      }

      // 将数组进行排序
      let cloneTemp = [...this.list]  // 将父组件传入的数据进行克隆
      let temp = cloneTemp[evt.oldIndex]  // 获取旧的下标
      cloneTemp.splice(evt.oldIndex, 1)   // 移除旧的下标
      cloneTemp.splice(evt.newIndex, 0, temp) // 将旧的下标进行替换
      this.putSortList(cloneTemp)
    },
    seeDetail (data, index) {
      this.currentID = index
      this.$emit('rightSelect', data)
    },
    stateColor (item) {
      return switchColor(item.State)
    },
    switchState (item) {
      return kdState(item.State)
    },
    switchCompany (item) {
      return kdCompany(item?.ShipperCode)
    },
  },
}
</script>

<style lang="scss" scoped>

</style>
