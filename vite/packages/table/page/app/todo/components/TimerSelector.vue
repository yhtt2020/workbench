<template>
  <!-- <calendar-outlined
    @click="selectTime"
    :style="{ color: this.modelValue ? '#1890ff' : '#BBBBBB' }"
  /> -->
  <Icon class="pointer" @click="selectTime" :style="{ color: this.modelValue ? '#1890ff' : 'var(--disable-text)' }" icon="calendar-check" style="font-size:20px"></Icon>
  <teleport to="body">


  <Modal blurFlag="true" v-model:visible="promptVisible" v-if="promptVisible" style="z-index:99999;">
    <div class="px-5 pb-5 xt-modal flex flex-col justify-between items-center" style="width:380px;height:300px;border-radius:16px">
      <div class="head-nav">
        <div class="ml-8">
          <a-tag  class="tag-item" @click="setToday">今天</a-tag>
          <a-tag  class="tag-item" @click="setTomorrow">明天</a-tag>
          <a-tag  class="tag-item" @click="setNextWeek">下周</a-tag>
          <a-tag  class="tag-item" @click="setNextMonth">下月</a-tag>
          <a-tag  class="tag-item" @click="setNextYear">明年</a-tag>
        </div>
        <div>
          <Icon @click="close" icon="guanbi" style="color:var(--primary-text);font-size:24px"></Icon>
        </div>
      </div>
      <div class="flex justify-center">
        <a-row type="flex">
          <a-col>
            <a-date-picker
              @change="onDatePickerChange"
              placeholder="选择日期"
              style="width: 100%;"
              v-model:value="newDate"
              class="input"
            />
            <a-time-picker
              @change="onTimePickerChange"
              style="width: 100%; margin-top: 10px"
              v-model:value="newTime"
              placeholder="选择时间"
              format="HH:mm"
              class="input"
            />
          </a-col>
          <a-col flex="140px"> </a-col>
        </a-row>
      </div>
      <div class="modal-btn">
        <div class="mr-3 rounded-lg xt-bg-2 pointer" @click="clearTime">清除</div>
        <div class="mr-3 rounded-lg xt-bg-2 pointer" @click="seTime">确定</div>
      </div>
    </div>
  </Modal>  </teleport>
  <!-- <a-modal
    @ok="seTime"
    @cancel="clearDeadTime"
    v-model:visible="dateTimePickerVisible"
    :title="null"
    centered
    ok-text="设置"
    cancel-text="清除"
    :width="300"
    bodyStyle="backogurnd"
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
  </a-modal> -->
</template>

<script lang="ts">
import dayjs from "dayjs";
import objectSupport from "dayjs/plugin/objectSupport";
import { CalendarOutlined } from "@ant-design/icons-vue";
import Modal from "../../../../components/Modal.vue";
import { appStore } from "../../../../store";
import { mapActions, mapWritableState } from "pinia";
dayjs.locale("zh-cn");
dayjs.extend(objectSupport);
export default {
  name: "TimerSelector",
  components: {
    CalendarOutlined,
    Modal
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
      promptVisible: false
    };
  },
  computed: {
    ...mapWritableState(appStore, ['fullScreen']),
  },
  methods: {
    selectTime() {
      // this.dateTimePickerVisible = true;
      this.promptVisible = true
     // this.fullScreen = true
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
      // this.dateTimePickerVisible = false;
     // this.fullScreen = false
      this.promptVisible = false
      this.$emit("update:modelValue", time);
    },
    clearDeadTime(e) {
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
    close(){
      this.fullScreen = false
      this.promptVisible = false
    },
    clearTime(){
      this.newDate = null;
      this.newTime = null;
      this.$emit("update:modelValue", null);
      this.close()
    }
  },
};
</script>

<style scoped lang="scss">
.head-nav{
  width: 100%;
  height: 68px;
  position: relative;
  display: flex;
  align-items: center;
  font-size: 16px;
  color: var(--primary-text);
  font-weight: 500;
  border-bottom: 1px solid var(--divider);
  .tag-item{
    color: var(--secondary-text);
    cursor: pointer;
  }
  >div:nth-child(2){
    width: 44px;
    height: 44px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: var(--secondary-bg);
    border-radius: 12px;
    cursor: pointer;
    position: absolute;
    right: 0px;
  }
}
.modal-btn {
  display: flex;
  font-size: 16px;
  color: var(--primary-text);
  > div {
    width: 120px;
    height: 44px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 12px;
    background: var(--mask-bg);
  }
  >div:nth-child(2){
    background: var(--active-bg) !important;
  }
}

.input{
  width:200px;
  height: 48px;
  background: var(--secondary-bg);
  border-radius: 12px;
  color: var(--primary-text);
  font-size: 16px;
  border: 1px solid rgba(255,255,255,0.2);
}
</style>
