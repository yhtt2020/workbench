<template>
  <xt-container
    :desk="desk"
    :sizeList="sizeList"
    :options="options"
    :customIndex="customIndex"
    :menuList="menuList"
    :custom-data="customData"
    ref="cardSlot"
    :header="header"
    v-model:customSize="customData.customSize"
    @delete="deleteCard"
  >
    <div
      class="mt-1 content"
      style="
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 0;
        align-items: center;
      "
      v-if="countdownDays.length <= 0"
    >
      <!-- <a-empty :description="null" image="/img/test/load-ail.png" />
      <a-button
        type="primary"
        class="rounded-full xt-text xt--active-bg"
        @click="
          () => {
            settingVisible = true;
            goAddEvent();
          }
        "
        >立即添加
      </a-button> -->

      <Unusual
        :newIcon="'fluent-emoji-flat:tear-off-calendar'"
        :normalButtonTitle="'立即添加'"
        :disableEdit="options.disableEdit"
        @back="
          () => {
            settingVisible = true;
            goAddEvent();
          }
        "
      />

    </div>

    <div class="mt-1 content" style="height: 100%; overflow: hidden" v-else>
      <xt-scrollbar
        @click="openRightDrawer"
        class="w-full h-full pointer"
        :y="true"
      >
        <div
          class="px-4 mb-3 event-list s-item xt-bg-2"
          style=""
          v-for="item in countdownDays"
        >
          <div class="flex flex-row items-center">
            <div class="mr-4 round-dot"></div>
            <div class="event-title">
              <span class="text-more w-28 xt-text" style="font-size: 16px">{{
                item.eventValue
              }}</span>
              <span class="event xt-text" style="font-size: 12px"
                >{{ item.dateValue.year }}/{{ item.dateValue.month }}/{{
                  item.dateValue.day
                }}</span
              >
            </div>
          </div>
          <span class="xt-text" style="font-size: 16px"
            ><span v-if="item.type">还有</span> <span v-else>已过</span>
            {{ differenceDay(item) }} 天</span
          >
        </div>
      </xt-scrollbar>
    </div>
  </xt-container>

  <a-drawer
    :width="500"
    v-model:visible="settingVisible"
    placement="right"
    @close="
      () => {
        this.goAddFlag = false;
      }
    "
  >
    <template #title>
      <div class="text-center">纪念日设置</div>
    </template>

    <CardSettingExplain v-if="communityAuth(desk?.communityNo)" />

    <div v-if="!goAddFlag">
      已设置的纪念日
      <div>
        <vue-custom-scrollbar
          :settings="outerSettings"
          style="
            position: relative;
            height: calc(100vh - 15em);
            margin-top: 10px;
          "
          class="scroll"
        >
          <div
            class="px-4 mb-3 event-list s-item xt-bg-2 xt-text"
            v-for="(item, index) in countdownDays"
          >
            <div class="flex flex-row items-center justify-between w-full">
              <div class="flex flex-row items-center">
                <div class="mr-4 round-dot"></div>
                <div class="event-title">
                  <span class="text-more" style="font-size: 16px">{{
                    item.eventValue
                  }}</span>
                  <span class="event" style="font-size: 12px"
                    >{{ item.dateValue.year }}/{{ item.dateValue.month }}/{{
                      item.dateValue.day
                    }}</span
                  >
                </div>
              </div>
              <span style="font-size: 18px"
                ><span v-if="item.type">还有</span> <span v-else>已过</span>
                {{ differenceDay(item) }} 天</span
              >

              <xt-button
                @click="(e) => onContextMenuClick(e, index)"
                type="theme"
                >删除</xt-button
              >
            </div>
          </div>
        </vue-custom-scrollbar>
      </div>
      <div class="flex flex-row items-center justify-center w-full mt-4">
        <div
          class="flex items-center justify-center w-full h-10 rounded-lg xt-active-bg pointer"
          style="color: var(--primary-text)"
          @click="goAddEvent"
        >
          添加事件
        </div>
      </div>
    </div>

    <div v-else>
      <div>事件名称</div>
      <xt-input
        class="h-12 mt-4 rounded-lg xt-text"
        style="height: 48px"
        v-model="eventValue"
        placeholder="请输入"
      ></xt-input>
      <!-- <a-input class="h-10 mt-4 rounded-lg xt-text" allow-clear v-model:value="eventValue" placeholder="请输入"/> -->
      <div class="mt-4">日期</div>
      <a-date-picker v-model:value="dateValue" class="mt-4" />
      <div
        class="flex flex-row items-center justify-center w-full mt-4 xt-text"
        style="color: var(--primary-text)"
      >
        <div
          class="flex items-center justify-center w-24 h-10 mr-4 rounded-lg pointer xt-bg-2"
          style="color: var(--primary-text)"
          @click="
            () => {
              this.goAddFlag = false;
            }
          "
        >
          取消
        </div>
        <div
          class="flex items-center justify-center w-24 h-10 rounded-lg pointer xt-active-bg"
          style="color: var(--primary-text)"
          @click="addEvent"
        >
          确定添加
        </div>
      </div>
    </div>
  </a-drawer>

  <!--  <a-drawer-->
  <!--    :contentWrapperStyle="{ padding:10,marginLeft:'2.5%',-->
  <!--    backgroundColor:'#1F1F1F',width: '95%',height:'11em',borderRadius:'5%'}"-->
  <!--    :width="120"-->
  <!--    :height="120"-->
  <!--    class="drawer"-->
  <!--    :closable="false"-->
  <!--    placement="bottom"-->
  <!--    :visible="visible"-->
  <!--    @close="onClose"-->
  <!--  >-->
  <!--    <div style="display: flex;flex-direction: row;height: 100%"><div class="option" style="margin: 0" @click="onSetup"><Icon-->
  <!--      style="-->
  <!--        width: 3em;-->
  <!--        height: 3em;-->
  <!--        vertical-align: middle;-->
  <!--      "-->
  <!--      icon="shezhi1"-->
  <!--    ></Icon>设置</div>-->
  <!--      <div class="option" @click="removeCountdownDay"><Icon-->
  <!--        style="-->
  <!--        width: 3em;-->
  <!--        height: 3em;-->
  <!--        vertical-align: middle;-->
  <!--      "-->
  <!--        icon="guanbi2"-->
  <!--      ></Icon>删除</div></div>-->

  <!--  </a-drawer>-->
</template>

<script>
import { mapActions, mapWritableState } from "pinia";
import { cardStore } from "../../store/card";
import { transDate } from "../../../../src/util/dateTime";
import Widget from "../card/Widget.vue";
import { message } from "ant-design-vue";
import { timeStamp } from "../../util";
import { timerStore } from "../../store/timer";
import { Icon as newIcon } from "@iconify/vue";
import { communityNavStore } from "../bottomPanel/store/communityNavStore";
import CardSettingExplain from "../CardSettingExplain.vue";
import { communityAuth } from "../../apps/communityDesk/hooks/deskCreateMethod";
import Unusual from "./Unusual.vue";

export default {
  name: "CountdownDay",
  props: {
    customIndex: {
      type: Number,
      default: 0,
    },
    customData: {
      type: Object,
      default: () => {},
    },
    desk: {
      type: Object,
    },
    openWay: {
      type: String,
      default: "desk",
    },
  },
  components: {
    Widget,
    newIcon,
    CardSettingExplain,
    Unusual,
  },
  emit: ["delete"],
  data() {
    return {
      outerSettings: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true,
      },
      eventValue: "",
      sizeList: [
        { value: "2x2", name: "2x2" },
        {
          value: "2x4",
          name: "2x4",
        },
      ],
      dateValue: null,
      menuList: [
        {
          icon: "shezhi1",
          title: "设置",
          fn: () => {
            this.settingVisible = true;
            this.$refs.cardSlot.visible = false;
          },
        },
      ],
      settingVisible: false,
      status: "pause",
      value: null,
      visible: false,
      goAddFlag: false,
      countdownDays: [],
      header: {
        title: "纪念日",
        // ifyIcon:'fluent:calendar-16-regular',
        showIcon:"/logo/countdownDay.svg",
      }
    }
  },
  computed: {
    ...mapWritableState(cardStore, ["countdownDay"]),
    ...mapWritableState(timerStore, ["appDate"]),

    options() {
      return {
        defaultData: {
          customSize: this.customData.customSize || "2x2",
          _updateFlag: "24531",
        },
        customDel: this.openWay === "nav" ? true : false,
        disableEdit: this.isCommunityDesktop(this.desk),
      };
    },
  },
  mounted() {
    this.sortCountdown();
    this.setCountdownDay();
    if (this.customData.customSize == undefined) {
      this.customData.customSize = "2x2";
    }

    if (this.options.disableEdit) {
      this.sizeList = [];
      this.menuList = [];
    } else {
      this.sizeList = [
        { value: "2x2", name: "2x2" },
        {
          value: "2x4",
          name: "2x4",
        },
      ];
      this.menuList = [
        {
          icon: "shezhi1",
          title: "设置",
          fn: () => {
            this.settingVisible = true;
            this.$refs.cardSlot.visible = false;
          },
        },
      ];
    }
  },
  methods: {
    ...mapActions(cardStore, [
      "removeCountdownDay",
      "addCountdownDay",
      "sortCountdown",
    ]),
    ...mapActions(communityNavStore, ["isCommunityDesktop"]),
    communityAuth,

    onPanelChange(value, mode) {},
    transDate,
    deleteCard() {
      this.$emit("delete");
    },
    differenceDay(item) {
      return transDate(
        this.appDate.year + "-" + this.appDate.month + "-" + this.appDate.day,
        item.dateValue.year +
          "-" +
          item.dateValue.month +
          "-" +
          item.dateValue.day
      );
    },
    closeDrawer() {
      this.goAddFlag = false;
      this.settingVisible = false;
    },
    onSetup() {
      this.$router.push({
        name: "addCardSetting",
        params: {
          name: "countdownDay",
          cname: "纪念日",
        },
      });
    },

    onContextMenuClick(e, index) {
      this.removeCountdownDay(index);
    },
    goAddEvent() {
      this.goAddFlag = true;
    },
    addEvent() {
      if (this.eventValue === "" || this.dateValue === null) {
        message.info("不可为空！");
        return;
      }
      this.goAddFlag = false;
      this.addCountdownDay({
        eventValue: this.eventValue,
        dateValue: timeStamp(this.dateValue.valueOf()),
        customIndex: this.customIndex,
      });
      this.eventValue = "";
      this.dateValue = null;
      message.info("添加成功！");
    },
    setCountdownDay() {
      let countdownDay = JSON.parse(JSON.stringify(this.countdownDay));
      if (this.customData.notRetain) {
        for (let i = 0; i < countdownDay.length; i++) {
          if (countdownDay[i].customIndex) {
            countdownDay.splice(i, 1);
            i--;
          }
        }
        this.countdownDays = countdownDay;
      } else {
        this.countdownDays = this.countdownDay;
      }
    },

    // 开启右侧抽屉弹窗
    openRightDrawer() {
      if (this.communityRole) {
        this.settingVisible = false;
      } else {
        this.settingVisible = true;
      }
    },
  },
  watch: {
    countdownDay: {
      deep: true,
      handler(val) {
        this.setCountdownDay();
      },
    },
    customSize(newVal, oldVal) {
      this.customData.customSize = newVal;
    },
  },
};
</script>

<style scoped lang="scss">
.content {
  position: relative;

  .title-icon {
    position: absolute;
    right: 1em;
    top: 1em;
  }
}

.event-list {
  width: 100%;
  display: flex;
  padding: 9px 16px 9px 12px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.4em;
  border-radius: 12px;
}

.event-title {
  display: flex;
  flex-direction: column;
  overflow: hidden; //文本超出隐藏
  text-overflow: ellipsis;
  text-align: left;

  .event {
    padding: 0;
    margin: 0;
    font-size: 0.8em;
    color: #6a6a6a;
  }
}

:deep(.ant-empty-image) {
  height: 60px;
}
</style>
