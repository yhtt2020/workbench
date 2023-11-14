<script lang="ts">
import Cover from "./component/Cover.vue";
import {message, Modal} from "ant-design-vue";
import {mapActions, mapWritableState} from "pinia";
import {courierStore} from "../../../apps/ecommerce/courier";
import {Icon as SmallIcon} from '@iconify/vue'

export default {
  name: "ListItem",
  components: {Cover, SmallIcon},
  props: ['item'],
  methods: {
    ...mapActions(courierStore, ['removeDbData', 'putSortList', 'followCourier', 'unfollowCourier']),
    goDetail() {
      this.$emit('goDetail', this.item)
    },
    refreshData() {
      this.displayList = this.list
    },
  },
  data() {
    return {
      revID: -1,
      displayList: [],
    }
  },
  computed: {
    ...mapWritableState(courierStore, ['currentDetail']),
    menus() {
      return [
        this.item.followed ? {
            name: '取消关注',
            callBack: async () => {
              let rs = await this.unfollowCourier(this.item._id)
              if (rs) {
                this.item.followed = false
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
              console.log('item', this.item)
              let rs = await this.followCourier(this.item._id)
              if (rs) {
                this.item.followed = true
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
              content: '确认删除订单',
              centered: true,
              onOk: () => {
                let rs = this.removeDbData(this.item)
                if (rs) {
                  message.success('删除成功。')
                  this.$emit('removeItem', this.item)
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
  watch: {
    'list': {
      handler() {
        this.refreshData()
      },
      immediate: true
    }
  }
}
</script>

<template>
  <xt-menu name="name" @contextmenu="revID = index" :menus="menus">
    <div :class="{ 'select': this.currentDetail?._id ===  item._id }"
         class="flex flex-col p-3 mb-3 rounded-lg xt-text pointer xt-bg-2 courier-item hover-bg"
         @click="goDetail">
      <div class="flex">
        <div class="flex items-center justify-center mr-4 rounded-lg">
          <Cover :cover="item.cover" :store="item.store" bg="var(--mask-bg)"></Cover>
        </div>
        <div class="flex items-center justify-between flex-1 w-0">
          <div class="flex flex-col flex-1 w-0">
            <div class="flex items-center mb-1.5 ">
              <div v-if="item.store==='jd'" class="w-6 h-6 store flex items-center justify-center rounded-md"
                   style="background:#E12419;"> JD
              </div>
              <div v-if="item.store==='tb'" class="w-6 h-6 store flex items-center justify-center rounded-md"
                   style="background:#FA5000;"> 淘
              </div>
              <div class="xt-font font-14 font-600 mx-1.5  flex-1 w-0 flex mt-1" style="width: calc(100% - 70px); ">
                <div :title="item.title" class="truncate">{{ item.title }}</div>
                <span class="fav-icon">
                      <SmallIcon v-if="!item.followed" icon="fluent:star-12-regular"/>
                      <SmallIcon icon="fluent:star-16-filled" v-else style="color:var(--warning);"/></span>
              </div>

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
</template>

<style scoped lang="scss">
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
  vertical-align: text-bottom;
  text-align: center;
  display: inline-block;
}

.fav-icon {
  font-size: 18px;
  display: inline-block;
  min-width: 18px;
}
</style>
