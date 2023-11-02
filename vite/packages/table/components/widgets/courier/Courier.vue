<template>
  <Widget :desk="desk" :sizeList="sizeList" :options="options" :customIndex="customIndex" :menuList="menuList"
          ref="cardSlot">
    <template #left-title-icon>
      <div class="icon"
           style="width: 35px;height: 24px;display: flex; justify-content: center;align-items: center;position: absolute;left: 2px;">
        <newIcon icon="fluent:box-16-regular" class="" style="font-size: 20px;"></newIcon>
      </div>
    </template>
    <div class="w-full h-full courier">
      <div style="position: absolute;left: 124px;top: 16px;" @click="refreshCourier" class="pointer"
           v-if="courierList.length > 0">
        <xt-button :w="22" :h="22" style="background: transparent;">
          <newIcon class="xt-text refresh" style=" font-size: 18px;margin-top: 1px;vertical-align: sub;"
                   icon="akar-icons:arrow-clockwise"/>
        </xt-button>
      </div>
      <!-- {{ courierList.length }} -->
      <div v-if="isLoading">
        <a-spin style="display: flex; justify-content: center; align-items:center;margin-top: 25%"/>
      </div>
      <template v-else>
        <div v-if="showWay">
          <MinEmpty v-if="courierDetailList.length <= 0"/>
          <MinCourierItem v-else :courier="courierDetailList[0]"></MinCourierItem>
        </div>
        <template v-else>
          <Empty v-if="courierDetailList.length <= 0"/>
          <template v-else>
            <vue-custom-scrollbar ref="threadListRef" :key="currentPage" :settings="outerSettings"
                                  style="height: calc(100% - 20px) ;overflow: hidden;flex-shrink: 0;width: 100%;">
              <CourierItem v-for="(item, index) in courierDetailList" :key="index" :courier="item"/>
            </vue-custom-scrollbar>
            <div class="item-content" style="position: absolute;right: 24px;bottom: 10px">
              <xt-button @click="bindJd" :w="120" :h="40" type="theme" class=" mr-2"
              >
                <newIcon class="text-lg xt-text "
                         style="vertical-align: middle;font-size: 20px;text-align: center;margin: 5px ;"
                         icon="fluent:add-16-filled"/>
                绑定京东
              </xt-button>
              <xt-button :w="40" :h="40" type="theme" @click="settingVisible" class="add-courier"
              >
                <newIcon class="text-lg xt-text "
                         style="vertical-align: sub;font-size: 20px;text-align: center;margin: 10px ;"
                         icon="fluent:add-16-filled"/>
              </xt-button>
            </div>

          </template>
        </template>
      </template>

    </div>

  </Widget>
</template>
<script>
import Widget from '../../card/Widget.vue'
import { Icon as newIcon } from '@iconify/vue'
import CourierItem from './CourierItem.vue'
import { courier } from './mock'
import MinCourierItem from './MinCourierItem.vue'
import Empty from './Empty.vue'
import MinEmpty from './MinEmpty.vue'
import { courierStore } from '../../../store/courier.ts'
import { mapWritableState, mapActions } from 'pinia'
import { message, Modal } from 'ant-design-vue'

export default {
  name: '我的快递',
  components: {
    Widget,
    newIcon,
    CourierItem,
    MinCourierItem,
    Empty,
    MinEmpty
  },
  props: {
    customIndex: {
      type: Number,
      default: 0
    },
    customData: {
      type: Object,
      default: () => { }
    },
    desk: {
      type: Object
    }
  },
  data () {
    return {
      settingVisible: false,
      sizeList: [
        {
          title: '2x2',
          height: 1,
          width: 1,
          name: '2x2'
        },
        {
          title: '4x4',
          height: 2,
          width: 2,
          name: '4x4'
        },
        {
          title: '4x6',
          height: 3,
          width: 2,
          name: '4x6'
        },

      ],
      options: {
        className: 'card double',
        title: '我的快递',
        icon: '',
        type: 'Courier'
      },
      menuList: [
        {
          newIcon: 'fluent:add-16-filled',
          title: '添加快递',
          fn: () => { console.log(1) }
        },
        {
          newIcon: 'fluent:box-16-regular',
          title: '全部快递',
          fn: () => { console.log(1) }
        },
        // {
        //     icon: 'shezhi1',
        //     title: '设置',
        //     fn: () => { this.settingVisible = true; this.$refs.cardSlot.visible = false }
        // },
      ],
      courierList: courier,
      outerSettings: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true,
      },
      isLoading: false,
    }
  },
  methods: {
    ...mapActions(courierStore, ['getCourierMsg']),
    refreshCourier () {
      this.getCourierMsg('YD', '463193332336436')
    },

    bindJd () {
      Modal.confirm({
        centered: true,
        content: '请在弹出窗内完成京东登录，登录后系统会在后台为您获取订单信息。',
        onOk: () => {
          tsbApi.web.openPreloadWindow({
            width: 1200,
            height: 800,
            background: false,
            url: 'https://passport.jd.com/uc/login',
            preload: window.globalArgs['app-dir_name'] + '/../appPreload/ecommerce/jd/login.js',
            callback: (data) => {
              message.loading({
                content: '已成功绑定账号：' + data.nickname + '，正在为您获取订单信息，请稍候…',
                key: 'loadingTip',
                duration:0
              })
              console.log('登录成功了，接下来进行下一步')
              //todo 获取到登录成功的信号
              tsbApi.web.openPreloadWindow({
                background: true,
                url: 'https://order.jd.com/center/list.action',
                preload: window.globalArgs['app-dir_name'] + '/../appPreload/ecommerce/jd/order.js',
                callback: (data) => {
                  message.success({ content: '获取订单成功!', key: 'loadingTip', duration: 3 })
                  console.log(data)
                }
              })
            }
          })

        }
      })
    }
  },
  computed: {
    ...mapWritableState(courierStore, ['courierMsgList', 'courierDetailList']),
    // 判断尺寸大小
    showSize () {
      if (this.customData && this.customData.width && this.customData.height) {
        return { width: this.customData.width, height: this.customData.height }
      }
      return this.sizeList[2]
    },
    showWay () {
      if (this.showSize.height === 1) {
        return true
      } else {
        return false
      }
    },
    courierMsg () {
      return this.courierMsgList
    }
  },
  mounted () {
    this.isLoading = true
    setTimeout(() => {
      this.isLoading = false
    })
  },

}
</script>
<style lang="scss">
.refresh {
  &:hover {
    background-color: var(--secondary-bg);
  }
}

.courier {
  .add-courier {
    display: none;

  }

  &:hover {
    .add-courier {
      display: block;
    }
  }
}
</style>
