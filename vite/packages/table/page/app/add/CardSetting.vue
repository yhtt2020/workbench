<template>
  <div class="title">
    <Icon
      style="
        width: 5em;
        height: 5em;
        margin-right: 10px;
        vertical-align: middle;
      "
      icon="fanqie"
    ></Icon>
    <span>「{{ title }}」设置</span>
  </div>
  <div class="card content" v-if="cardType === 'CountdownDay'">
    <a-row>
      <a-col :span="10" style="border-right: 1px solid #454545; height: 100vh">
        <a-row> <a-col>卡片样式 </a-col></a-row>
        <a-row>
          <a-col
            ><a-select v-model:value="CountdownDayType">
              <a-select-option value="大">大</a-select-option>
              <a-select-option value="小">小</a-select-option>
            </a-select>
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
          <a-col>
            <a-date-picker
              v-model:value="DateValue"
              :disabled-date="
                (current) => {
                  return current && current < dayjs().endOf('day');
                }
              " /></a-col
        ></a-row>
        <a-row>
          <a-col>
            <a-button type="primary" @click="AddCard">添加</a-button></a-col
          ></a-row
        >
      </a-col>
      <a-col :span="14">
        <a-row>
          <a-col> 已添加的{{ title }}</a-col></a-row
        >
        <a-row>
          <div
            class="card event"
            v-for="item in CountdownDay"
            style="background-color: #3b3b3b"
          >
            <div class="eventTitle">
              <span>{{ item.EventValue }}</span>
              <span class="event"
                >{{ item.DateValue.year }}年{{ item.DateValue.month }}月{{
                  item.DateValue.day
                }}日</span
              >
            </div>
            <span
              >{{
                TransDate(
                  appDate.year + "-" + appDate.month + "-" + appDate.day,
                  item.DateValue.year +
                    "-" +
                    item.DateValue.month +
                    "-" +
                    item.DateValue.day
                )
              }}天</span
            >
          </div></a-row
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
          <a-col :span="8">
            <a-time-picker v-model:value="ClockDate" format="HH:mm"
          /></a-col>
          <a-col :span="4"
            ><a-select v-model:value="clockType">
              <a-select-option value="不重复">不重复</a-select-option>
              <a-select-option value="每天">每天</a-select-option>
            </a-select></a-col
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
        <a-row>
          <div
            class="card event"
            v-for="item in ClockEvent"
            style="background-color: #3b3b3b"
          >
            <div class="eventTitle">
              <span>{{ item.EventValue }}</span>
              <span class="event">{{ item.clockType }}</span>
            </div>
            <span>{{ item.DateValue.hours }}:{{ item.DateValue.minutes }}</span>
          </div></a-row
        >
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { mapWritableState, mapActions } from "pinia";
import { appStore } from "../../../store";
import { shijianc, TransDate } from "../../../util";
import dayjs from "dayjs";
export default {
  name: "XtCardSetting",

  data() {
    return {
      title: "",
      CountdownDayType: "大",
      clockType: "不重复",

      EventValue: [],
      DateValue: null,
      ClockDate: null,
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
    ]),
    AddCard() {
      this.addCustomComponents(this.$route.params["name"]);
      this.addCountdownDay({
        EventValue: this.EventValue,
        DateValue: shijianc(this.DateValue.valueOf()),
      });
      this.$router.push({
        name: "home",
      });
    },
    AddClock() {
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
  },
};
</script>

<style lang="scss" scoped>
.event {
  display: flex;
  padding: 0.2em 0.5em;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 55%;
  margin-top: 0.5em;
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
  height: 100vh;
}
.ant-row {
  margin: 1em;
}
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
</style>
