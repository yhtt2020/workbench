<template>
  <div class="w-full flex flex-col" v-if="emptyObj">
    <UpdateIcon :orderData="detail"/>

    <!--  商品订单详情  -->
    <template v-if="detail.store">
      <div class="flex flex-col xt-bg-2 px-3 mb-4 py-2.5 rounded-md">
        <div class="flex justify-between w-full">
          <span class="summary xt-text font-14 font-400"
                style="max-width: 335px;">IKEA宜家弗瑞顿转角沙发床带储物坐卧两用客厅简约</span>
          <span class="xt-font font-16 font-600 xt-text">￥2810</span>
        </div>
        <div class="flex justify-between w-full my-1.5">
          <span class="xt-text-2 font-14 font-400">弗瑞顿 深灰色 惠力尔沙发 2米以上</span>
          <span class="xt-text-2 font-14 font-400">x1</span>
        </div>
        <template v-if="detailVisible">
          <div class="flex justify-between w-full my-1.5">
            <span class="xt-text-2 font-14 font-400">下单时间：2023-10-31 20:00:23</span>
            <span class="xt-text-2 font-14 font-400">xxxx(收)</span>
          </div>
          <div class="flex w-full">
        <span class="xt-text-2 font-14 font-400">
          订单编号：{{ orderNum }}
        </span>
            <div class="flex items-center pointer justify-center" @click="copyOrderNum">
              <DetailIcon icon="fluent:copy-16-regular" class="xt-text-2" style="font-size: 1.25rem;"/>
            </div>
          </div>

          <div class="flex items-center justify-center w-full">
            <xt-button h="20" @click="detailVisible = false">
              <div class="flex items-center justify-center">
                <span class="xt-text-2">收起</span>
                <DetailIcon class="xt-text-2" icon="ri:arrow-up-s-line" style="font-size: 1.25rem;"/>
              </div>
            </xt-button>
          </div>
        </template>

        <template v-else>
          <div class="flex items-center justify-center w-full">
            <xt-button h="20" @click="detailVisible = true">
              <div class="flex items-center justify-center">
                <span class="xt-text-2">更多信息</span>
                <DetailIcon class="xt-text-2" icon="ri:arrow-down-s-line" style="font-size: 1.5rem;"/>
              </div>
            </xt-button>
          </div>
        </template>
      </div>
    </template>
    <div class="px-4 rounded-lg xt-bg-2" :style="detailVisible ? {height:'245px'} :{height:'310px'}">
      <template v-if="detail?.Traces.length === 0">
        <EmptyModal/>
      </template>
      <vue-custom-scrollbar :settings="settingsScroller" :style="detailVisible ? {height:'228px'} :{height:'291px'}"
                            v-else>
        <div class="flex items-center justify-center">
          <div class="px-1.5 py-0.5 my-4 font-14 font-400 rounded-md xt-bg" style="color:var(--active-bg);">
            预计11月4日15:00-19:00到达
          </div>
        </div>
        <TimeLine :list="detail?.Traces"/>
      </vue-custom-scrollbar>
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
      settingsScroller: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true
      },
      orderNum: '2325336804199588681',
      detailVisible: false,
    }
  },

  computed: {
    emptyObj () {
      return Object.keys(this.detail).length !== 0
    }
  },

  methods: {
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
