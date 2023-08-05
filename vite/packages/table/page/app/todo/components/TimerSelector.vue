<template>
  <!-- <calendar-outlined
    @click="selectTime"
    :style="{ color: this.modelValue ? '#1890ff' : '#BBBBBB' }"
  /> -->
  <Icon class="pointer" @click="selectTime" :style="{ color: this.modelValue ? '#1890ff' : 'var(--disable-text)' }" icon="calendar-check" style="font-size:20px"></Icon>
  <a-modal
    @ok="seTime"
    @cancel="clearDeadTime"
    v-model:visible="dateTimePickerVisible"
    :title="null"
    centered
    ok-text="设置"
    cancel-text="清除"
    :width="300"
  >
    <a-tag @click="setToday">今天</a-tag>
    <a-tag @click="setTomorrow">明天</a-tag>
    <a-tag @click="setNextWeek">下周</a-tag>
    <a-tag @click="setNextMonth">下月</a-tag>
    <a-tag @click="setNextYear">明年</a-tag>
    <a-divider style="margin-top: 5px; margin-bottom: 5px"></a-divider>
    <div>
      <a-row type="flex">
        <a-col flex="220px">
          <a-date-picker
            @change="onDatePickerChange"
            placeholder="选择日期"
            style="width: 100%"
            v-model:value="newDate"
          />
          <a-time-picker
            @change="onTimePickerChange"
            style="width: 100%; margin-top: 10px"
            v-model:value="newTime"
            placeholder="选择时间"
            format="HH:mm"
          />
        </a-col>
        <a-col flex="140px"> </a-col>
      </a-row>
    </div>
  </a-modal>
</template>

<script lang="ts">
import dayjs from "dayjs";
import objectSupport from "dayjs/plugin/objectSupport";
import { CalendarOutlined } from "@ant-design/icons-vue";
dayjs.locale("zh-cn");
dayjs.extend(objectSupport);
export default {
  name: "TimerSelector",
  components: {
    CalendarOutlined,
  },
  props: {
    modelValue: {
      type: Number,
    },
  },
  watch: {
    modelValue(newV, oldV) {
      if (newV === null) {
        this.newDate = null;
        this.newTime = null;
      }
    },
  },
  data() {
    return {
      time: this.modelValue,
      dateTimePickerVisible: false,
      newDate: null,
      newTime: null,
    };
  },
  methods: {
    selectTime() {
      this.dateTimePickerVisible = true;
    },
    setTimeDayEnd(force = false) {
      if (force || this.newTime === null) {
        this.newTime = dayjs({
          hour: 23,
          minute: 59,
        });
      }
    },
    setToday() {
      this.newDate = dayjs();
      this.setTimeDayEnd();
    },
    setTomorrow() {
      this.newDate = dayjs().add(1, "day");
      this.setTimeDayEnd();
    },
    setNextWeek() {
      this.newDate = dayjs().add(7, "day");
      this.setTimeDayEnd();
    },
    setNextYear() {
      this.newDate = dayjs().add(1, "year");
      this.setTimeDayEnd();
    },
    setNextMonth() {
      this.newDate = dayjs().add(1, "month");
      this.setTimeDayEnd();
    },
    seTime() {
      let newTime;
      if (this.newDate) {
        if (this.newTime === null) {
          this.setTimeDayEnd();
        }
        newTime = dayjs({
          year: this.newDate.year(),
          month: this.newDate.month(),
          day: this.newDate.date(),
          hour: this.newTime.hour(),
          minute: this.newTime.minute(),
        });
      }
      let time = newTime.unix();
      this.dateTimePickerVisible = false;
      this.$emit("update:modelValue", time);
    },
    clearDeadTime(e) {
      console.log(e);
      if (e.target.nodeName.toLowerCase() === "span") {
        this.newDate = null;
        this.newTime = null;
        this.$emit("update:modelValue", null);
      }
    },
    onTimePickerChange() {
      if (this.newTime) {
        if (this.newDate === null) {
          this.newDate = dayjs();
        }
      }
    },
    onDatePickerChange() {
      if (this.newDate) {
        if (this.newTime === null) {
          this.setTimeDayEnd(false);
        }
      }
    },
  },
};
</script>

<style scoped></style>
