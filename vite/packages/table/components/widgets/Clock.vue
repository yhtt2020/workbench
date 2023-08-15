<template>
  <Widget :desk="desk" :options="options" :customIndex="customIndex" :menuList="menus" ref="cardSlot">
    <div v-if="countDowntime.hours"
         style="display: flex;flex-direction: column;justify-content: space-between; ">
      <div class="right-title" @click.stop="showDrawer" @contextmenu.stop="showDrawer">
        <Icon icon="gengduo1" class="title-icon" style="cursor:pointer"></Icon>
      </div>
      <div style="text-align: center; font-size: 1.5em;color: var(--primary-text);">计时</div>
      <div style="color: #FBAE17;font-size: 4em;font-weight:bolder">
        {{ countDowntime.hours + ':' + countDowntime.minutes + ':' + countDowntime.seconds }}
      </div>
      <div style="display: flex;align-items: center;justify-content: space-between;padding: 0 6em;">
        <Icon
          style="width: 3em; height: 3em;cursor:pointer;color: var(--primary-text);"
          icon="zanting"
          @click="closeCountDown" v-show="!countDownBtn"
        ></Icon>
        <Icon
          style="width: 3em; height: 3em;cursor:pointer;color: #FBAE17"
          icon="bofang"
          @click="startCountDown" v-show="countDownBtn"
        ></Icon>
        <Icon
          style="width: 2em; height: 2em;cursor:pointer;color: var(--primary-text);"
          icon="guanbi1"
          @click="deleteCountDown"
        ></Icon>
      </div>
    </div>
    <div class="text-center" v-else-if="clockEvent.length <= 0" style="width: 100%">
      <div class="right-title" @click.stop="showDrawer" @contextmenu.stop="showDrawer">
        <Icon icon="gengduo1" class="title-icon" style="cursor:pointer"></Icon>
      </div>
      <a-empty style="margin-top: 40px" :description="null" :image="simpleImage"/>
      <a-button type="primary" class=" xt-text xt--active-bg rounded-full" style="border: none;"
                @click="onSetup">添加闹钟
      </a-button>
    </div>
    <div @click="onSetup" class="  cursor-pointer text-center " v-else
    >
      <div class="right-title" @click.stop="showDrawer" @contextmenu.stop="showDrawer">
        <Icon icon="gengduo1" class="title-icon" style="cursor:pointer"></Icon>
      </div>
      <div style="text-align: center; font-size: 1.5em">下一个闹钟</div>
      <div style="font-size: 3em; margin-top: 0.5em">
        <icon icon="naozhong"></icon>
        {{ clockEvent[0].dateValue.hours }}:{{ clockEvent[0].dateValue.minutes }}
      </div>
      <div style="font-size: 1.5em; margin-top: 0.5em" class="text-more">
        {{ clockEvent[0].eventValue }}
      </div>
    </div>
    <template #menuExtra>
      <div class="option h-24 w-24 mr-4" @click="onCountDown(3)">
        <Icon
          class="icon"
          icon="shijian3dian"
        ></Icon>
        3分钟
      </div>
      <div class="option h-24 w-24 mr-4" @click="onCountDown(10)">
        <Icon
          class="icon"
          icon="shijian3dian"
        ></Icon>
        10分钟
      </div>
      <div class="option h-24 w-24 mr-4" @click="onCountDown(30)">
        <Icon
          class="icon"
          icon="shijian3dian"
        ></Icon>
        30分钟
      </div>
      <div class="option h-24 w-24 mr-4" @click="onCountDown(300)">
        <Icon
          class="icon"
          icon="shijian3dian"
        ></Icon>
        自定义
      </div>
      <div class="option h-24 w-24 mr-4" @click="onSetup">
        <Icon
          class="icon"
          icon="shezhi1"
        ></Icon>
        设置
      </div>
    </template>
  </Widget>



  <a-modal v-model:visible="custom" title="" @ok="()=>{}" :footer="null"
           style="font-size: 8px;color: var(--primary-text);" :maskClosable="false">
    <div style="display: flex;flex-direction: column;align-items: center;">
      <div style="">自定义倒计时</div>
      <a-space direction="vertical" style="margin: 14px" :popupStyle="{zIndex:9999999999999}">
        <a-time-picker v-model:value="value1" size="large" :popupStyle="{zIndex:9999999999999}"/>
      </a-space>
      <a-button type="primary" @click="addCustom" style="margin: 14px">开始倒计时</a-button>
    </div>
  </a-modal>
</template>

<script>
import { mapWritableState, mapActions } from 'pinia'
import { countDownStore } from '../../store/countDown'
import { cardStore } from '../../store/card'
import dayjs from 'dayjs'
import Widget from '../card/Widget.vue'

export default {
  name: 'Clock',
  components: { Widget },
  props: {
    customIndex: {
      type: Number,
      default: 0
    },
    desk: {
      type: Object
    },

  },
  data () {
    return {
      simpleImage: '/public/img/test/load-ail.png',
      visible: false,
      value1: dayjs('00:00:00', 'HH:mm'),
      custom: false,
      options: {
        className: 'card small',
        title: '闹钟',
        noTitle: true
      },
      menus: []
    }
  },
  computed: {
    ...mapWritableState(cardStore, ['appDate', 'clockEvent']),
    ...mapWritableState(countDownStore, ['countDowndate', 'countDowntime', 'countDownBtn']),
  },

  methods: {
    ...mapActions(cardStore, ['removeCard']),
    ...mapActions(countDownStore, ['setCountDown', 'stopCountDown', 'openCountDown', 'dCountDown']),
    onContextMenuClick (e) {

    },
    showDrawer () {
      this.visible = true
    },
    onClose () {
      this.visible = false
    },
    onSetup () {
      this.$router.push({
        name: 'addCardSetting',
        params: {
          name: 'clock',
          cname: '闹钟',
        },
      })
    },
    removeClock () {
      this.removeCard(this.customIndex)
      this.dCountDown()
      this.visible = false
    },
    onCountDown (value) {
      switch (value) {
        case 3:
          this.setCountDown({ hours: 0, minutes: 3, seconds: 0 })
          break
        case 10:
          this.setCountDown({ hours: 0, minutes: 10, seconds: 0 })
          break
        case 30:
          this.setCountDown({ hours: 0, minutes: 30, seconds: 0 })
          break
        case 300:
          this.custom = true
          break
      }
      this.$refs.cardSlot.hideMenu()
      this.countDownBtn = false
    }, closeCountDown () {

      this.stopCountDown()

    },
    startCountDown () {

      this.openCountDown()

    },
    deleteCountDown () {
      this.dCountDown()
    },
    closeCustom () {
      this.custom = false
    },
    addCustom () {
      this.setCountDown({
        hours: parseFloat(this.value1.$H),
        minutes: parseFloat(this.value1.$m),
        seconds: parseFloat(this.value1.$s)
      })
      this.custom = false
    }
  },

}
</script>

<style scoped lang="scss">


.ant-dropdown-open {
  border-radius: 100%;
}

[ant-click-animating-without-extra-node='true']::after, .ant-click-animating-node {
  background: #676767;
  box-shadow: #676767;
  animation: none
}

.drawer {
  margin: 10em;
}


:deep(.ant-empty-image) {
  height: 60px;
}
</style>
