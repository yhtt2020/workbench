<template>
  <div class="card content" style="" v-if="countdownDay.length <= 0">
    <Icon
      style="width: 2em; height: 2em"
      icon="gengduo1"
      class="title-icon"
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
          class="title-icon"
        ></Icon>
      </div>
    </div>
    <div
      class="event-list"
      v-for="item in countdownDay.slice(0, 6)"
      style="background-color: #3b3b3b"
    >
      <div class="event-title">
        <span class="text-more">{{ item.eventValue }}</span>
        <span class="event"
          >{{ item.dateValue.year }}年{{ item.dateValue.month }}月{{
            item.dateValue.day
          }}日</span
        >
      </div>
      <span
        >{{
          transDate(
            appDate.year + "-" + appDate.month + "-" + appDate.day,
            item.dateValue.year +
              "-" +
              item.dateValue.month +
              "-" +
              item.dateValue.day
          )
        }}天</span
      >
    </div>
  </div>
</template>

<script>
import { mapWritableState } from "pinia";
import { tableStore } from "../../store";
import { transDate } from "../../../../src/util/dateTime";
export default {
  name: "CountdownDay",
  data() {
    return {
      status: "pause",
      value: null,
    };
  },
  computed: {
    ...mapWritableState(tableStore, ["appDate", "countdownDay"]),
  },
  methods: {
    onPanelChange(value, mode) {},
    transDate,
  },
};
</script>

<style scoped lang="scss">
.content {
  position: relative;

  .title-icon {
    position: absolute;
    right: 1em;
  }
}
.event-list {
  width: 17em;

  display: flex;
  padding: 0.2em 0.5em;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  margin-top: 0.7em;
}
.event-title {
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
