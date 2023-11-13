<template>
  <div class="w-full flex flex-col h-full" v-if="emptyObj">
    <UpdateIcon :orderData="detail"/>

    <!--  商品订单详情  -->
    <template v-if="detail.store">
      <div class="flex flex-col xt-bg-2 px-3 mb-4 py-2.5 rounded-md">
        <div class="flex justify-between w-full">
          <span class=" xt-text font-14 font-400"
                style="max-width: 100%;">{{ detail.title }}</span>
          <span class="xt-font font-16 font-600 xt-text ml-2">{{content.amount}}</span>
        </div>
        <div v-if="detailVisible" v-for="item in content.items" class="flex justify-between w-full my-1.5">
          <div class="flex">
            <div class="mr-1">
              <a-avatar  shape="square" :src="item.cover"></a-avatar>
            </div>
            <div class="flex-1 " style="width:340px">
              <div class="xt-text-2 font-14   font-400   " >{{ item.name }}</div>
            </div>
            <div class="ml-1">
              <span class="xt-text-2 font-14 font-400">{{ item.num }}</span>
            </div>
          </div>

        </div>
        <template v-if="detailVisible">
          <div class="flex justify-between w-full my-1.5">
            <span class="xt-text-2 font-14 font-400">下单时间：{{ content.dealtime }}</span>
<!--            <span class="xt-text-2 font-14 font-400">{{  }}(收)</span>-->
          </div>
          <div class="flex w-full">
        <span class="xt-text-2 font-14 font-400">
          订单编号：{{ content?.id }}
        </span>
            <div class="flex items-center pointer justify-center" @click="copyOrderNum">
              <DetailIcon icon="fluent:copy-16-regular" class="xt-text-2" style="font-size: 1.25rem;"/>
            </div>
          </div>

          <div class="flex items-center justify-center w-full">
            <xt-button h="20" @click="detailVisible = false">
              <div class="flex items-center justify-center">
                <span class="xt-text-2 font-14">收起</span>
                <DetailIcon class="xt-text-2" icon="ri:arrow-up-s-line" style="font-size: 1.25rem;"/>
              </div>
            </xt-button>
          </div>
        </template>

        <template v-else>
          <div class="flex items-center justify-center w-full">
            <xt-button h="20" @click="detailVisible = true">
              <div class="flex items-center justify-center">
                <span class="xt-text-2 font-14">更多信息</span>
                <DetailIcon class="xt-text-2" icon="ri:arrow-down-s-line" style="font-size: 1.5rem;"/>
              </div>
            </xt-button>
          </div>
        </template>
      </div>
    </template>
    <div class="px-4 rounded-lg xt-bg-2 flex-1 h-0">
      <template v-if="!detail.store">
        <template v-if="content?.Traces.length === 0">
          <EmptyModal/>
        </template>
        <vue-custom-scrollbar class="h-full" :settings="settingsScroller"
                              v-else>
          <TimeLine :list="content?.Traces"/>
        </vue-custom-scrollbar>
      </template>
      <template v-if="detail.store==='jd'">
        <template v-if="traces.length === 0">
          <EmptyModal/>
        </template>
        <vue-custom-scrollbar class="h-full" :settings="settingsScroller"
                              v-else>
          <div v-if="content.arrivalAt" class="flex items-center justify-center">
            <div class="px-1.5 py-0.5 my-4 font-14 font-400 rounded-md xt-bg" style="color:var(--active-bg);">
              {{ content.arrivalAt }}
            </div>
          </div>
          <TimeLine :list="traces"/>
        </vue-custom-scrollbar>
      </template>


    </div>
  </div>
</template>

<script>
import { Icon as DetailIcon } from '@iconify/vue'
import useClipboard from 'vue-clipboard3'
import { message, Modal } from 'ant-design-vue'

import TimeLine from '../timeLine/index.vue'
import UpdateIcon from '../updateIcon/index.vue'
import EmptyModal from '../../EmptyModal.vue'

export default {
  props: ['detail'],

  components: {
    TimeLine, UpdateIcon, EmptyModal, DetailIcon
  },

  data () {
    return {
      content: {},
      settingsScroller: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true
      },
      orderNum: '',
      detailVisible: false,
      traces:[]
    }
  },

  computed: {
    emptyObj () {
      return Object.keys(this.detail).length !== 0
    }
  },
  mounted () {


  },
  watch:{
    'detail':{
      handler(){
        if(this.detail._id){
          this.refreshData()
        }
      },
      immediate:true
    }
  },
  methods: {
    refreshData(){
      this.orderNum=this.detail.orderId
      this.content = this.detail.content
      if(this.detail.store==='jd'){
        this.traces=[]
        for(const t of this.content.latestNodes){
          this.traces.push({
            AcceptTime:t.time,
            AcceptStation:t.txt
          })
        }
      }

      console.log('刷新一下数据',this.traces)
    },
    // 复制订单号
    async copyOrderNum () {
      const { toClipboard } = useClipboard()
      const res = await toClipboard(this.orderNum)
      if (res.text !== '') {
        message.success('群聊ID成功复制')
      }
    }
  }

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
</style>
