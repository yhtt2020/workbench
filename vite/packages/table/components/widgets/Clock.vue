<template>
  <xt-container
    v-model:customSize="customData.customSize"
    :customData="customData"
    :desk="desk"
    :options="options"
    :header="header"
    :customIndex="customIndex"
    :menuList="menuList"
    ref="cardSlot"
    @delete="deleteCard"
  >
    <!-- <div class="flex flex-col items-center"> -->
    <div
      v-if="countDowntime.hours"
      style="
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      "
      class="-mt-2"
    >
      <div
        style="text-align: center; color: var(--primary-text); font-size: 16px"
        class="font-14"
      >
        <clockIcon
          icon="fluent:clock-12-regular"
          class="mr-2 title-icon"
          style="
            cursor: pointer;
            font-size: 20px;
            text-align: center;
            vertical-align: sub;
          "
        >
        </clockIcon>
        计时器
      </div>
      <div
        style="
          color: #fbae17;
          font-size: 40px;
          font-weight: 600;
          text-align: center;
          font-family: Oswald-SemiBold;
        "
        class="mt-2 mb-2"
      >
        {{
          countDowntime.hours +
          ":" +
          countDowntime.minutes +
          ":" +
          countDowntime.seconds
        }}
      </div>
      <div
        style="
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 6em;
        "
      >
        <clockIcon
          style="
            width: 2em;
            height: 2em;
            cursor: pointer;
            color: var(--primary-text);
          "
          icon="akar-icons:pause"
          @click="closeCountDown"
          v-show="!countDownBtn"
        ></clockIcon>
        <clockIcon
          style="
            width: 2em;
            height: 2em;
            cursor: pointer;
            color: var(--primary-text);
          "
          icon="fluent:play-16-filled"
          @click="startCountDown"
          v-show="countDownBtn"
        ></clockIcon>
        <clockIcon
          style="
            width: 2em;
            height: 2em;
            cursor: pointer;
            color: var(--primary-text);
          "
          icon="fluent:dismiss-16-filled"
          @click="deleteCountDown"
        ></clockIcon>
      </div>
    </div>
    <div
      class="flex flex-col h-full text-center"
      v-else-if="clockEvent.length <= 0"
      style="width: 100%"
    >
      <Unusual
        :newIcon="'fluent-emoji:alarm-clock'"
        :normalButtonTitle="'添加闹钟'"
        :addButtonTitle="'添加定时器'"
        :menuAble="true"
        :menuList="timerMenu"
        :buttonColor="'#fbae17'"
        @back="onSetup"
        v-if="!options.disableEdit"
      />

      <template v-else>
        <div class="flex flex-col items-center justify-center h-full">
          <xt-ify-icon icon="fluent-emoji:alarm-clock" class="pb-4" size="56" />
          <span class="xt-text xt-font font-16">暂无数据</span>
        </div>
      </template>

      <!-- <div
        class="flex flex-col items-center justify-center h-full"
        v-if="!options.disableEdit"
      >
        <xt-button
          class="rounded-lg w-[120px] h-[45px] xt-active-bg mb-4 border-0 p-0 font-16"
          type="primary"
          @click="onSetup"
        >
          添加闹钟
        </xt-button>

        <xt-menu :menus="timerMenu" name="name" fn="cb">
          <div class="flex flex-col items-center justify-center">
            <xt-button
              type="text"
              class="rounded-lg w-[120px] h-[45px] border-0 p-0 font-16"
              style="background-color: #fbae17"
            >
              添加定时器
            </xt-button>
          </div>
          @click="onSetCountDown"
        </xt-menu>        
      </div>-->
      
    </div>
    <div
      @click="onSetup"
      class="flex flex-col text-center cursor-pointer"
      v-else
    >
      <div
        style="
          text-align: center;
          font-family: PingFangSC-Regular !important;
          font-size: 16px;
          font-weight: 400;
        "
        class="font-14"
      >
        <clockIcon
          icon="fluent:clock-alarm-16-filled"
          class="mr-2 title-icon"
          style="
            cursor: pointer;
            font-size: 20px;
            text-align: center;
            vertical-align: sub;
          "
        >
        </clockIcon>
        下一个闹钟
      </div>

      <div
        class="mt-2 mb-4 font-40"
        style="
          font-family: Oswald-SemiBold !important;
          font-size: 40px;
          font-weight: 600;
        "
      >
        {{ clockEvent[0].dateValue.hours }}:{{
          clockEvent[0].dateValue.minutes
        }}
      </div>
      <div
        class="text-more font-14"
        style="font-family: PingFangSC-Regular !important; font-size: 16px"
      >
        {{ clockEvent[0].eventValue }}
      </div>
    </div>
  </xt-container>

  <a-drawer
    v-model:visible="topClockSettingVisible"
    class="custom-class xt-text"
    style="color: red"
    title="设置"
    placement="right"
    :width="600"
  >
    <CardSettingExplain
      v-if="communityAuth(desk?.communityNo)"
      style="margin-bottom: 0 !important"
    />

    <div
      class="flex"
      :class="communityAuth(desk?.communityNo) ? 'mt-4' : 'mt-0'"
    >
      <SetupClock></SetupClock>
    </div>
  </a-drawer>

  <a-modal
    v-model:visible="custom"
    title=""
    @ok="() => {}"
    :footer="null"
    centered
    popupClassName="{popupClass}"
    style="font-size: 8px; color: var(--primary-text)"
    :maskClosable="false"
  >
    <div style="display: flex; flex-direction: column; align-items: center">
      <div style="">自定义倒计时</div>
      <a-space direction="vertical" style="margin: 14px">
        <a-time-picker v-model:value="value1" size="large" :showNow="false" />
      </a-space>
      <xt-button
        type="primary"
        @click="addCustom"
        style="margin: 14px; background: var(--active-bg)"
        >开始倒计时</xt-button
      >
    </div>
  </a-modal>
</template>

<script>
import { mapWritableState, mapActions } from "pinia";
import { countDownStore } from "../../store/countDown";
import { cardStore } from "../../store/card";
import { topClockSettingStore } from "../../store/topClockSetting";
import dayjs from "dayjs";
import Widget from "../card/Widget.vue";
import { Icon as clockIcon } from "@iconify/vue";
import SetupClock from "./setClock.vue";
import { communityNavStore } from "../bottomPanel/store/communityNavStore";
import Unusual from "./Unusual.vue";
import CardSettingExplain from "../CardSettingExplain.vue";
import { communityAuth } from "../../apps/communityDesk/hooks/deskCreateMethod";

export default {
  name: "Clock",
  components: { Widget, clockIcon, SetupClock, Unusual, CardSettingExplain },
  props: {
    customIndex: {
      type: Number,
      default: 0,
    },
    desk: {
      type: Object,
    },
    customData: {
      type: Object,
    },
    openWay: {
      type: String,
      default: "desk",
    },
  },
  data() {
    return {
      header: {
        title: "闹钟",
        showIcon: "/img/appLogo/alarmClock.png",
      },
      simpleImage: "/public/img/test/load-ail.png",
      visible: false,
      value1: dayjs("00:00:00", "HH:mm"),
      custom: false,
      menuList: [
        {
          icon: "shezhi1",
          title: "设置",
          fn: () => {
            this.settingVisible = true;
            this.$refs.cardSlot.visible = false;
            this.changeSettingStatus();
          },
        },
      ],
      timerMenu: [
        {
          newIcon: "fluent:clock-12-filled",
          name: "3分钟",
          cb: () => {
            this.onCountDown(3);
          },
        },
        {
          newIcon: "fluent:clock-12-filled",
          name: "10分钟",
          cb: () => {
            this.onCountDown(10);
          },
        },
        {
          newIcon: "fluent:clock-12-filled",
          name: "30分钟",
          cb: () => {
            this.onCountDown(30);
          },
        },
        {
          newIcon: "fluent:clock-12-filled",
          name: "自定义",
          cb: () => {
            this.onCountDown(300);
          },
        },
      ],
      visibleDrawer: false,
      clockValue: "",
      setClockName: "未命名",
      settingVisible: false,
    };
  },
  computed: {
    ...mapWritableState(cardStore, ["appDate", "clockEvent"]),
    ...mapWritableState(countDownStore, [
      "countDowndate",
      "countDowntime",
      "countDownBtn",
    ]),
    ...mapWritableState(topClockSettingStore, ["topClockSettingVisible"]),

    options() {
      return {
        customDel: this.openWay === "nav" ? true : false,
        disableEdit: this.isCommunityDesktop(this.desk),
      };
    },
  },
  mounted() {
    this.customData.customSize = "2x2";

    if (this.options.disableEdit) {
      this.menuList = [];
    } else {
      this.menuList = [
        {
          icon: "shezhi1",
          title: "设置",
          fn: () => {
            this.settingVisible = true;
            this.$refs.cardSlot.visible = false;
            this.changeSettingStatus();
          },
        },
      ];
    }
  },
  emit: ["delete"],
  methods: {
    ...mapActions(cardStore, ["removeCard"]),
    ...mapActions(countDownStore, [
      "setCountDown",
      "stopCountDown",
      "openCountDown",
      "dCountDown",
    ]),
    ...mapActions(topClockSettingStore, ["changeSettingStatus"]),
    ...mapActions(communityNavStore, ["isCommunityDesktop"]),
    communityAuth,

    deleteCard() {
      this.$emit("delete");
    },
    onSetCountDown() {
      this.$refs.cardSlot.menuVisible = true;
    },
    showDrawer() {
      this.visible = true;
    },
    onClose() {
      this.visible = false;
    },
    onSetup() {
      // this.topClockSettingVisible = true
      this.changeSettingStatus();
      // this.$router.push({
      //   name: 'addCardSetting',
      //   params: {
      //     name: 'clock',
      //     cname: '闹钟',
      //   },
      // })
    },
    removeClock() {
      this.removeCard(this.customIndex);
      this.dCountDown();
      this.visible = false;
    },
    onCountDown(value) {
      switch (value) {
        case 3:
          this.setCountDown({ hours: 0, minutes: 3, seconds: 0 });
          break;
        case 10:
          this.setCountDown({ hours: 0, minutes: 10, seconds: 0 });
          break;
        case 30:
          this.setCountDown({ hours: 0, minutes: 30, seconds: 0 });
          break;
        case 300:
          this.custom = true;
          break;
      }
      // this.$refs.cardSlot.hideMenu()
      this.countDownBtn = false;
    },
    closeCountDown() {
      this.stopCountDown();
    },
    startCountDown() {
      this.openCountDown();
    },
    deleteCountDown() {
      this.dCountDown();
    },
    closeCustom() {
      this.custom = false;
    },
    addCustom() {
      this.setCountDown({
        hours: parseFloat(this.value1.$H),
        minutes: parseFloat(this.value1.$m),
        seconds: parseFloat(this.value1.$s),
      });
      this.custom = false;
    },
  },
};
</script>

<style scoped lang="scss">
.ant-dropdown-open {
  border-radius: 100%;
}

[ant-click-animating-without-extra-node="true"]::after,
.ant-click-animating-node {
  background: #676767;
  box-shadow: #676767;
  animation: none;
}

.drawer {
  margin: 10em;
}

font-40 {
  font-family: Oswald-SemiBold;
  font-size: 40px;
  font-weight: 600;
}

font-14 {
  font-size: 14px;
  font-weight: 400;
}

font-16 {
  font-size: 16px;
  font-weight: 500;
}

:deep(.ant-empty-image) {
  height: 60px;
}

:deep(.anticon.ant-input-clear-icon) {
  color: var(--secondary-text);
}
.popupClass {
  background-color: var(--primary-bg);
}
:deep(.ant-picker-panel-container) {
  background-color: var(--primary-bg) !important;
}
</style>
