<template>
  <div class="flex flex-col" @click="getColor">
    <div style="width: 452px;" class="flex items-center justify-between px-4 py-3 mb-3 rounded-lg h-11 xt-bg-2">
      <span class="xt-text-2 font-14 font-400">「全部」分类下支持拖拽排序。</span>
      <!-- <div class="flex items-center justify-center">
   </div> -->
    </div>
    <vue-custom-scrollbar :settings="settingsScroller">
      <div style="width: 452px; height:480px;" ref="dropRef">
        <div v-for="(item, index) in list" class="rounded-lg">
          <!-- {{ item }} -->
          <xt-menu name="name" @contextmenu="revID = item" :menus="menus">
            <div :class="{ 'select': this.currentID === item.LogisticCode }"
              class="flex p-3 mb-3 rounded-lg xt-text pointer xt-bg-2 courier-item hover-bg" @click="seeDetail(item)">
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
                        {{ switchCompany[index] }}
                      </div>
                      <div class="flex items-center pl-1 pr-1 rounded-md" :style="{ 'background': stateColor[index] }">
                        {{ switchState[index] }}
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
import { mapActions, mapWritableState } from 'pinia'
import { courierModalStore } from '../courierModalStore'
import { Icon as SmallIcon } from '@iconify/vue'
import { courierType } from '../modalMock'
import Sortable from 'sortablejs'
import { kdCompany, kdState, switchColor } from '../../mock'
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

      //  currentID:'',

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

          },
          newIcon: 'akar-icons:trash-can',
          color: 'var(--error)'
        },
      ],
      currentID: '',

    }
  },

  computed: {
    stateColor() {
      let colorList = this.list.map((item) => {
        return switchColor(item.State)
      })
      return colorList
    },
    switchState() {
      let stateList = this.list.map((item) => {
        return kdState(item.State)
      })
      return stateList
    },
    switchCompany() {
      let companyList = this.list.map((item) => {
        return kdCompany(item.ShipperCode)
      })
      return companyList
    },
  },


  mounted() {
    this.$nextTick(() => {
      const el = this.$refs.dropRef
      new Sortable(el, {
        group: 'sortableGroup',
        onEnd: this.onSortEnd // 拖拽结束时触发的回调函数
      })
    })
    this.currentID = this.list[0].LogisticCode
  },

  methods: {
    ...mapActions(courierModalStore, ['updateSortList']),
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
      // this.detailList = cloneTemp
      this.updateSortList(cloneTemp)
    },

    seeDetail(data) {
      this.currentID = data.LogisticCode
      this.$emit('rightSelect', data)
    },

    // 根据不同标识进行背景色获取
    getBgColor(data) {
      const findItem = courierType.find((item) => {
        return item.name === data.status
      })
      return findItem
    },
    // getColor(){
    //   let temp= this.list.map((item)=>{
    //     return switchColor(item.State)
    //   })
    //   console.log(temp);
    // }

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
.hover-bg{
  &:hover{
    background-color: var(--active-secondary-bg);
  }
}
</style>