<script lang="ts">
import Cover from "./component/Cover.vue";
import {message, Modal} from "ant-design-vue";
import {mapActions, mapWritableState} from "pinia";
import {courierStore} from "../../../apps/ecommerce/courier";
import {Icon as SmallIcon} from '@iconify/vue'

export default {
  name: "ListItem",
  components: {Cover, SmallIcon},
  props: ['item','noBg'],
  methods: {
    ...mapActions(courierStore, ['updateOrder','removeDbData', 'putSortList', 'followCourier', 'unfollowCourier','setTopCourier','hideCourier','showCourier']),
    goDetail() {
      this.$emit('goDetail', this.item)
    },
    setFirstActive(){
      if(this.orderList.length>0){
        this.currentDetail=this.orderList[0]
      }else{
        this.currentDetail=null
      }
    }
  },
  data() {
    return {
    }
  },
  computed: {
    ...mapWritableState(courierStore, ['currentDetail','orderList']),
    menus() {
      return [
        {
          name: '更新此订单',
          callBack: async () => {
            let rs=await this.updateOrder(this.item._id)
            if(rs){
              for(const key of Object.keys(rs)){
                this.item[key]=rs[key] //全键更新
              }
              console.log(rs,this.item)
              message.success('刷新订单成功')
            }else{
              message.error('刷新订单失败')
            }
          },
          newIcon: 'fluent:arrow-counterclockwise-20-filled'
        },
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
            name: '关注订单',
            callBack: async () => {
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
          name: '移至顶部',
          newIcon: 'fluent:arrow-upload-16-filled',
          callBack:async()=>{
            let rs = await this.setTopCourier(this.item._id)
            if (rs) {
              this.item.followed = true
              message.success('置顶成功')
              this.setFirstActive()
              this.$emit('scrollToCurrent')
            } else {
              message.error('置顶失败')
            }
          }
        },
        this.item.hide ?{
          name: '显示订单',
          callBack: async () => {
            let rs = await this.showCourier(this.item._id)
            if (rs) {
              message.success('显示成功。')
              this.$emit('showItem', this.item)
            }
          },
          newIcon:'fluent:eye-off-16-regular'

        }:{
          name: '隐藏订单',
          callBack: () => {
            Modal.confirm({
              content: '隐藏订单后，即使重新获取订单也不会再出现。需要手动单独在隐藏订单中恢复。',
              centered: true,
              okText:'确认隐藏',
              onOk: async () => {
                let rs = await this.hideCourier(this.item._id)
                if (rs) {
                  message.success('隐藏成功。')
                  this.$emit('hideItem', this.item)
                }
              }
            })
          },
          newIcon:'fluent:eye-off-16-regular'
        },
        {
          name: '删除订单',
          callBack: () => {
            Modal.confirm({
              content: '确认删除订单？删除的订单在下次同步的时候仍然会被添加回列表。如果不希望显示此订单，请使用隐藏功能。',
              centered: true,
              onOk: async () => {
                let rs = await this.removeDbData(this.item)
                if (rs) {
                  message.success('删除成功。')
                  this.$emit('removeItem', this.item)
                  this.$emit('afterRemove',this.item)
                }
              }
            })
          },
          newIcon: 'akar-icons:trash-can',
        },
      ]
    }
  }
}
</script>

<template>
  <xt-menu  name="name" :menus="menus">
    <div ref="itemRef" :class="{ 'select': this.currentDetail?._id ===  item._id ,'xt-bg-2':!noBg,'mb-3':!noBg }"
         class="flex flex-col p-3  rounded-lg xt-text pointer courier-item hover-bg"
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
                <span class="fav-icon ml-1">
                      <SmallIcon v-if="!item.followed" icon="fluent:star-12-regular"/>
                      <SmallIcon icon="fluent:star-16-filled" v-else style="color:var(--warning);"/></span>
              </div>

            </div>
            <div class="flex">
              <div class="flex items-center pl-1 pr-1 mr-2 rounded-md xt-bg " style="width:68px;">
                {{ item.company }}
              </div>
              <div class="flex items-center pl-1 pr-1 mr-2 rounded-md xt-bg xt-text-2"
                   v-if="item.content.parentOrderId">
                拆
              </div>
              <div class="xt-text" v-if="item.content.arrivalAt">
                {{ item.content.arrivalAt?.replace('您的订单','').replace('您手中','') }}
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
.courier-item{
  border:2px solid transparent;
}
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
    background-color: var(--active-secondary-bg) !important;
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
