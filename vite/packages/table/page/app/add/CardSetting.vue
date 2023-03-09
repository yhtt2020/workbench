<template>
  <div class="title">
    <Icon
      style="width: 5%; height: 2em; margin-right: 1%; vertical-align: middle"
      icon="shezhi1"
    ></Icon>
    <span>「{{ title }}」设置</span>
  </div>
  <div class="card content" v-if="cardType === 'CountdownDay'">
    <a-row>
      <a-col :span="10" style="border-right: 1px solid #454545; height: 100vh">
        <a-row> <a-col>卡片样式 </a-col></a-row>
        <a-row>
          <a-col>
            <a-radio-group
              v-model:value="CountdownDayType"
              button-style="solid"
            >
              <a-radio-button value="大">大</a-radio-button>
              <a-radio-button value="小">小</a-radio-button>
            </a-radio-group>
          </a-col></a-row
        >
        <a-row> <a-col>事件名字 </a-col></a-row>
        <a-row>
          <a-col>
            <a-input v-model:value="EventValue" placeholder="请输入"
          /></a-col>
        </a-row>
        <a-row> <a-col>日期 </a-col></a-row>
        <a-row>
          <div class="button">
            <a-date-picker
              v-model:value="DateValue"
              :disabled-date="
                (current) => {
                  return current && current < dayjs().endOf('day');
                }
              "
            />
            <a-button type="primary" @click="AddCard">添加</a-button>
          </div>
        </a-row>
      </a-col>
      <a-col :span="14">
        <a-row>
          <a-col> 已添加的{{ title }}</a-col></a-row
        >
        <vue-custom-scrollbar
          :settings="outerSettings"
          style="position: relative; height: calc(100vh - 20em)"
          class="scroll"
        >
          <a-row>
            <div
              class="card eventList"
              v-for="(item, index) in CountdownDay"
              style="background-color: #3b3b3b"
            >
              <a-dropdown :trigger="['contextmenu']">
                <div class="cardList">
                  <div class="eventTitle">
                    <span class="text-more">{{ item.EventValue }}</span>
                    <span class="event"
                      >{{ item.DateValue.year }}年{{ item.DateValue.month }}月{{
                        item.DateValue.day
                      }}日</span
                    >
                  </div>
                  <div>
                    {{
                      TransDate(
                        appDate.year + "-" + appDate.month + "-" + appDate.day,
                        item.DateValue.year +
                          "-" +
                          item.DateValue.month +
                          "-" +
                          item.DateValue.day
                      )
                    }}天
                  </div>
                </div>

                <template #overlay>
                  <a-menu @click="(e) => onContextMenuClick(e, index)">
                    <a-menu-item key="1">删除</a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </div>
          </a-row></vue-custom-scrollbar
        >
      </a-col>
    </a-row>
  </div>
  <div class="card content" v-if="cardType === 'Clock'">
    <a-row>
      <a-col :span="10" style="border-right: 1px solid #454545; height: 100vh">
        <a-row> <a-col>事件名字 </a-col></a-row>
        <a-row>
          <a-col>
            <a-input v-model:value="EventValue" placeholder="请输入"
          /></a-col>
        </a-row>
        <a-row> <a-col>时间 </a-col></a-row>
        <a-row>
          <a-col :span="6" :xs="8">
            <a-time-picker v-model:value="ClockDate" format="HH:mm"
          /></a-col>
          <a-col :span="6" :xs="12" :offset="1">
            <a-radio-group v-model:value="clockType" button-style="solid">
              <a-radio-button value="不重复">不重复</a-radio-button>
              <a-radio-button value="每天">每天</a-radio-button>
            </a-radio-group></a-col
          ></a-row
        >
        <a-row>
          <a-col>
            <a-button type="primary" @click="AddClock">设置</a-button></a-col
          ></a-row
        >
      </a-col>
      <a-col :span="14">
        <a-row>
          <a-col> 已设置的{{ title }}</a-col></a-row
        >
        <vue-custom-scrollbar
          :settings="outerSettings"
          style="position: relative; height: calc(100vh - 20em)"
          class="scroll"
        >
          <a-row>
            <div
              class="card eventList"
              v-for="(item, index) in ClockEvent"
              style="background-color: #3b3b3b"
            >
              <a-dropdown :trigger="['contextmenu']">
                <div class="cardList">
                  <div class="eventTitle">
                    <span class="text-more">{{ item.EventValue }}</span>
                    <span class="event">{{ item.clockType }}</span>
                  </div>
                  <span
                    >{{ item.DateValue.hours }}:{{
                      item.DateValue.minutes
                    }}</span
                  >
                </div>
                <template #overlay>
                  <a-menu @click="(e) => onClockMenuClick(e, index)">
                    <a-menu-item key="1">删除</a-menu-item>
                  </a-menu>
                </template></a-dropdown
              >
            </div></a-row
          ></vue-custom-scrollbar
        >
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { mapWritableState, mapActions } from "pinia";
import { appStore } from "../../../store";
import { shijianc, TransDate } from "../../../util";
import { message } from "ant-design-vue";
import dayjs from "dayjs";
export default {
  name: "XtCardSetting",

  data() {
    return {
      outerSettings: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true,
      },
      title: "",
      CountdownDayType: "大",
      clockType: "不重复",

      EventValue: "",
      DateValue: null,
      ClockDate: null,
      flag: true,
    };
  },

  mounted() {
    if (this.$route.params["name"]) {
      // console.log(this.$route.params);
      this.title = this.$route.params["cname"];
      this.cardType = this.$route.params["name"];
    }
  },
  computed: {
    ...mapWritableState(appStore, ["CountdownDay", "appDate", "ClockEvent"]),
  },
  methods: {
    dayjs,
    TransDate,
    ...mapActions(appStore, [
      "addCountdownDay",
      "addClock",
      "addCustomComponents",
      "removeCountdownDay",
      "removeClock",
    ]),
    AddCard() {
      if (this.EventValue === "" || this.DateValue === null) {
        if (this.flag !== true) return;
        this.flag = false;
        setTimeout(() => {
          message.info("不可为空！");
          this.flag = true;
        }, 500);
        return;
      }
      this.addCustomComponents(
        this.$route.params["name"] + this.CountdownDayType
      );
      this.addCountdownDay({
        EventValue: this.EventValue,
        DateValue: shijianc(this.DateValue.valueOf()),
      });
      this.$router.push({
        name: "home",
      });
    },
    AddClock() {
      if (this.EventValue === "" || this.ClockDate === null) {
        if (this.flag !== true) return;
        this.flag = false;
        setTimeout(() => {
          message.info("不可为空！");
          this.flag = true;
        }, 500);
        return;
      }
      this.addClock({
        clockType: this.clockType,
        EventValue: this.EventValue,
        DateValue: shijianc(this.ClockDate.valueOf()),
      });
      this.addCustomComponents(this.$route.params["name"]);
      this.$router.push({
        name: "home",
      });
    },
    onContextMenuClick(e, index) {
      this.removeCountdownDay(index);
    },
    onClockMenuClick(e, index) {
      this.removeClock(index);
    },
  },
};
</script>

<style lang="scss" scoped>
.eventList {
  padding: 0.2em 0.5em;

  width: 100%;
  margin-top: 0.5em;
  .cardList {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    .eventTitle {
      display: flex;
      flex-direction: column;
      width: 70%;

      .event {
        padding: 0;
        margin: 0;
        font-size: 0.6em;
        color: #6a6a6a;
      }
    }
  }
}
.title {
  display: flex;
  align-items: center;
  color: #dddddd;
  font-size: 1.3em;
}
.content {
  color: #dddddd;
  font-size: 1.3em;

  padding: 0;
  margin: 0;
}
.ant-row {
  margin: 1em;
}
.scroll {
  width: 55%;
  @media screen and (max-width: 1100px) {
    width: 100%;
  }
}
.button {
  display: flex;
  flex-direction: column;
  height: 5em;
  width: 8em;
  justify-content: space-between;
  button {
    width: 6em;
  }
  @media screen and (max-width: 1200px) {
    flex-direction: row;
    height: 2em;
    width: 14em;
    align-items: center;
  }
}
</style>
