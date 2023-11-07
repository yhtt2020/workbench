<template>
  <div class="flex flex-col px-6">
    <div class="flex items-center justify-between px-4 py-3 mb-3 rounded-lg h-11 xt-bg-2">
      <span class="xt-text-2 font-14 font-400">「全部」分类下支持拖拽排序。</span>
    </div>
    <vue-custom-scrollbar :settings="settingsScroller">
      <div style="height:480px;" ref="dropRef">
        <div v-for="(item, index) in list" class="rounded-lg">
          <xt-menu name="name" @contextmenu="revID = index" :menus="menus">
            <div :class="{ 'select': sortItem === index }"
              class="flex p-3 mb-3 rounded-lg xt-text pointer xt-bg-2 courier-item" @click="sortDetail(item,index)">
              <div class="flex items-center justify-center mr-4 rounded-lg w-14 h-14" style="background: var(--mask-bg);">
                <SmallIcon icon="fluent-emoji:package" style="font-size: 2rem;" />
              </div>
              <div class="flex flex-col" style="width: calc(100% - 84px);">
                <div class="flex items-center justify-between ">
                  <span class="xt-font font-16 font-600">
                    {{ item.LogisticCode }}
                  </span>

                  <div class="flex">
                    <div class="flex xt-text-2" style="font-size: 14px;text-align: center;">
                      <div class="flex items-center pl-1 pr-1 mr-2 rounded-md xt-bg-2">
                        {{ switchCompany(item)}}
                      </div>
                      <div class="flex items-center pl-1 pr-1 rounded-md" :style="{ 'background': stateColor(item) }">
                        {{ switchState(item)}}
                      </div>
                    </div>
                  </div>
                </div>

                <div class="my-1.5 font-14 font-400 xt-text-2">{{ item.Traces[item.Traces.length - 1]?.AcceptTime }}</div>
                <div class="summary">
                  {{ item.Traces[item.Traces.length - 1]?.AcceptStation }}
                </div>
              </div>
            </div>
          </xt-menu>
        </div>
        <div style="height: 12px;"></div>
      </div>
    </vue-custom-scrollbar>
  </div>
</template>

<script>
import { mapActions } from 'pinia'
import { courierStore } from '../../../../../store/courier'
import { Icon as SmallIcon } from '@iconify/vue'
import Sortable from 'sortablejs'
import { kdCompany, kdState, switchColor } from '../../mock'
import { Modal,message } from 'ant-design-vue'

export default {
  props: ["list", "sortItem"],

  components: {
    SmallIcon
  },

  data() {
    return {
      settingsScroller: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true
      },
      revID: '',
      menus: [
        {
          name: '查看详情',
          callBack: () => {

          },
          newIcon: 'fluent:apps-list-detail-24-regular'
        },
        {
          name: '订阅物流',
          callBack: () => {

          },
          newIcon: 'fluent:star-12-regular'
        },
        {
          name: '删除快递',
          callBack: () => {
            Modal.confirm({
             content: '确认删除当前快递物流信息',
             centered: true,
             onOk: () => {
              this.removeDbData(this.revID)
              message.success('删除成功')
             } 
            })
          },
          newIcon: 'akar-icons:trash-can',
          color: 'var(--error)'
        },
      ],
      sortItem:''
    }
  },


  mounted() {
    this.$nextTick(() => {
      const el = this.$refs.dropRef
      new Sortable(el, {
        group: 'sortableGroup',
        onEnd: this.onSortEnd // 拖拽结束时触发的回调函数
      })
    })
  },

  methods: {
    ...mapActions(courierStore, ['putSortList','removeDbData']),
    onSortEnd(evt) {
      let newIndex = evt.newIndex, oldIndex = evt.oldIndex
      let newItem = this.$refs.dropRef.children[newIndex]
      let oldItem = this.$refs.dropRef.children[oldIndex]
      // 先删除移动的节点
      this.$refs.dropRef.removeChild(newItem)
      // 再插入移动的节点到原有节点，还原了移动的操作
      if (newIndex > oldIndex) {
        this.$refs.dropRef.insertBefore(newItem, oldItem)
      } else {
        this.$refs.dropRef.insertBefore(newItem, oldItem.nextSibling)
      }

      // 将数组进行排序
      let cloneTemp = [...this.list]  // 将父组件传入的数据进行克隆
      let temp = cloneTemp[evt.oldIndex]  // 获取旧的下标
      cloneTemp.splice(evt.oldIndex, 1)   // 移除旧的下标
      cloneTemp.splice(evt.newIndex, 0, temp) // 将旧的下标进行替换
      this.putSortList(cloneTemp)
    },

    seeDetail(data) {
      this.$emit('rightSelect', data)
    },

    stateColor(item) {
      return switchColor(item.State)
    },
    switchState(item) {
      return kdState(item.State)
    },
    switchCompany(item) {
      return kdCompany(item?.ShipperCode)
    },
    sortDetail(item,index){
     this.sortItem = index
     this.$emit('rightSelect',item)
    }
  },
};
</script>

<style lang="scss" scoped>
.summary {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  white-space: break-spaces;
  overflow: hidden;
  margin: 0 !important;
  font-size: 14px;
  color: var(--primary-text);
  font-weight: 400;
}

.select {
  background: var(--active-secondary-bg) !important;
}
</style>