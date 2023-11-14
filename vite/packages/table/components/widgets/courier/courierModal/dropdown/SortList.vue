<template>
  <div class="flex flex-col" @click="getColor">
    <div v-if="settings.tagVisible" class="flex items-center justify-between px-4 py-3 mb-3 rounded-lg h-11 xt-bg-2">
      <span class="xt-text-2 font-14 font-400">「全部」分类下支持拖拽排序。</span>
      <xt-button w="12" h="12" @click="settings.tagVisible = false">
        <div class="flex items-center justify-center">
          <SmallIcon icon="fluent:dismiss-16-filled" style="font-size: 1.25rem;"/>
        </div>
      </xt-button>
    </div>
    <vue-custom-scrollbar :settings="settingsScroller">
      <div style="height:460px;" ref="dropRef" class="w-full">
        <div v-for="(item, index) in displayList" class="rounded-lg">
          <xt-menu name="name" @contextmenu="revID = index" :menus="menus">
            <div :class="{ 'select': this.currentDetail._id ===  item._id }"
                 class="flex flex-col p-3 mb-3 rounded-lg xt-text pointer xt-bg-2 courier-item hover-bg"
                 @click="seeDetail(item,index)">
              <div class="flex">
                <div class="flex items-center justify-center mr-4 rounded-lg">
                  <Cover :cover="item.cover" :store="item.store" bg="var(--mask-bg)"></Cover>
                </div>
                <div class="flex items-center justify-between " style="width:362px;">
                  <div class="flex flex-col">
                    <div class="flex items-center mb-1.5 ">
                      <div v-if="item.store==='jd'" class="w-6 h-6 store flex items-center justify-center rounded-md"
                           style="background:#E12419;"> JD
                      </div>
                      <div v-if="item.store==='tb'" class="w-6 h-6 store flex items-center justify-center rounded-md"
                           style="background:#FA5000;"> 淘
                      </div>
                      <span class="xt-font font-14 font-600 mx-1.5">
                        {{ item.title?.slice(0, 20) }}
                      </span>
                      <span class="fav-icon">
                      <SmallIcon v-if="!item.followed" icon="fluent:star-12-regular"/>
                      <SmallIcon icon="fluent:star-16-filled" v-else style="color:var(--warning);"/></span>
                    </div>
                    <div class="flex">
                      <div class="flex items-center pl-1 pr-1 mr-2 rounded-md xt-bg " style="width:68px;">
                        {{ item.company }}
                      </div>
                      <div v-if="false" class="flex items-center justify-center rounded-md w-6 h-6 xt-text-2 xt-bg">拆
                      </div>
                    </div>
                  </div>
                  <div class="flex flex-col items-center justify-end">
                    <div class="flex items-center ml-8 mb-2 pl-1 pr-1 rounded-md state-text"
                         :style="{ 'background': item.tagColor,color:'var(--active-text)'}">
                      {{ item.stateText }}
                    </div>
                    <span v-if="false" class="xt-text-2 font-14 font-400">预计明天到达</span>
                  </div>
                </div>
              </div>

              <div class="flex flex-col">
                <div class="my-1.5 font-14 font-400 xt-text-2">{{ item.lastNodeTime }}</div>
                <div class="summary">
                  {{ item.lastNodeSummary }}
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
import { mapActions, mapWritableState } from 'pinia'
import { Icon as SmallIcon } from '@iconify/vue'
import Sortable from 'sortablejs'
import { kdCompany, kdState, switchColor, convertJdStatusColor } from '../../mock'
import { courierStore } from '../../../../../apps/ecommerce/courier'
import { message, Modal } from 'ant-design-vue'
import { appStore } from '../../../../../store'
import Cover from '../../component/Cover.vue'
export default {
  props: ['list', 'sortItem'],

  components: {
    Cover,
    SmallIcon
  },

  data () {
    return {
      settingsScroller: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true
      },
      revID: -1,
      displayList: [],

      currentID: '',
    }
  },

  computed: {
    ...mapWritableState(appStore, ['settings']),
    ...mapWritableState(courierStore, ['currentDetail']),
    menus(){
      if(!this.displayList || this.revID<0){
        return []
      }
      return [
        this.displayList[this.revID].followed ? {
            name: '取消关注',
            callBack: async () => {
              let rs = await this.unfollowCourier(this.displayList[this.revID]._id)
              if (rs) {
                this.displayList[this.revID].followed = false
                message.success('取消关注成功')
              } else {
                message.error('取消关注失败')
              }
            },
            newIcon: 'fluent:star-12-regular'
          } :
          {
            name: '关注物流',
            callBack: async () => {
              console.log('item', this.displayList[this.revID])
              let rs = await this.followCourier(this.displayList[this.revID]._id)
              if (rs) {
                this.displayList[this.revID].followed = true
                message.success('关注成功')
              } else {
                message.error('关注失败')
              }
            },
            newIcon: 'fluent:star-16-filled'
          }
        ,
        {
          name: '删除快递',
          callBack: () => {
            Modal.confirm({
              content: '确认删除当前快递物流信息',
              centered: true,
              onOk: () => {
                let rs = this.removeDbData(this.displayList[this.revID])
                if (rs) {
                  message.success('删除成功。')
                  this.displayList.splice(this.revID, 1)
                }
              }
            })
          },
          newIcon: 'akar-icons:trash-can',
          color: 'var(--error)'
        },
      ]
    }
  },

  mounted () {

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
    ...mapActions(courierStore, ['removeDbData', 'putSortList', 'followCourier','unfollowCourier']),
    refreshData () {
      this.displayList = this.list
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
.summary {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
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

.hover-bg {
  &:hover {
    background-color: var(--active-secondary-bg);
  }
}

.state-text {
  width: auto;
  text-wrap: nowrap;
}

.store {
  min-width: 25px;
}

.fav-icon {
  font-size: 18px;
  display: inline-block;
  min-width: 18px;
}
</style>
