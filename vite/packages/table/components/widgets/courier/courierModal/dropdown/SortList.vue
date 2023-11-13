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
                      <SmallIcon v-if="true" icon="fluent:star-12-regular"/>
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
      revID: '',
      displayList: [],
      menus: [
        {
          name: '订阅物流',
          callBack:async  () => {
            let rs=await this.followCourier(this.displayList[this.revID].id)
            if(rs){
              message.success('订阅成功')
            }else{
              message.error('订阅失败')
            }
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
      ],
      currentID: '',
    }
  },

  computed: {
    ...mapWritableState(appStore, ['settings']),
    ...mapWritableState(courierStore, ['currentDetail'])
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
    ...mapActions(courierStore, ['removeDbData', 'putSortList','followCourier']),
    refreshData () {
      this.displayList = [...this.list.map(item => {
        let newItem = {
          ...item
        }

        let content = item.content
        if (!newItem.store) {
          //快递鸟快递
          newItem.tagColor = switchColor(content.state)
          newItem.stateText = kdState(content.State)
          newItem.company = kdCompany(content.ShipperCode)
          if (content.Traces && content.Traces.length > 0) {
            newItem.lastNodeTime = content.Traces[content.Traces.length - 1]?.AcceptTime
            newItem.lastNodeSummary = content.Traces[content.Traces.length - 1]?.AcceptStation
          }
        } else if (newItem.store === 'jd') {
          console.log('content=', content)
          if (!content.expressType) {
            newItem.company = '京东快递'
          } else {
            newItem.company = content.expressType.slice(0, content.expressType.indexOf('快递') + 2)
          }
          newItem.stateText = content.status
          newItem.tagColor = convertJdStatusColor(content.status)
          if (content.latestNodes && content.latestNodes.length > 0) {
            newItem.lastNodeTime = content.latestNodes[0]?.time
            newItem.lastNodeSummary = content.latestNodes[0]?.txt
          }
        }
        return newItem
      })]
      console.log('displayList', this.displayList)
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
