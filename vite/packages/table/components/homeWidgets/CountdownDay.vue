<template>
  <div class="card content" style="" v-if="CountdownDay.length <= 0">
    <Icon
      style="width: 2em; height: 2em"
      icon="gengduo1"
      class="titleIcon"
    ></Icon>

    <a-empty :description="null" :image="simpleImage" />
  </div>
  <div class="card content" v-else>
    <div style="border-bottom: 1px solid #777777">
      <div class="title">
        <Icon
          icon="rili2"
          style="height: 1.3em; width: 1.3em; margin-right: 0.1em"
        ></Icon>
        倒数日
        <Icon
          style="width: 1em; height: 1em"
          icon="gengduo1"
          class="titleIcon"
        ></Icon>
      </div>
    </div>
    <div
      class="card eventList"
      v-for="item in CountdownDay.slice(0, 6)"
      style="background-color: #3b3b3b"
    >
      <div class="eventTitle">
        <span class="text-more">{{ item.EventValue }}</span>
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
    </div>
  </div>
</template>

<script>
import { mapWritableState } from "pinia";
import { appStore } from "../../store";
import { TransDate } from "../../../../src/util/dateTime";
export default {
  name: "CountdownDay",
  data() {
    return {
      status: "pause",
      value: null,
    };
  },
  computed: {
    ...mapWritableState(appStore, ["appDate", "CountdownDay"]),
  },
  methods: {
    onPanelChange(value, mode) {},
    TransDate,
  },
};
</script>

<style scoped lang="scss">
.content {
  position: relative;

  .titleIcon {
    position: absolute;
    right: 1em;
  }
}
.eventList {
  display: flex;
  padding: 0.2em 0.5em;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  margin-top: 0.7em;
}
.eventTitle {
  display: flex;
  flex-direction: column;
  overflow: hidden; //文本超出隐藏
  text-overflow: ellipsis;

  .event {
    padding: 0;
    margin: 0;
    font-size: 0.8em;
    color: #6a6a6a;
  }
}
</style>
