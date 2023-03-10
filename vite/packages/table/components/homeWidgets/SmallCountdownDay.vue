<template>
  <div
    class="card content"
    style="height: 14em; margin-bottom: 1em"
    v-if="countdownDay.length <= 0"
  >
    <Icon
      style="width: 2em; height: 2em"
      icon="gengduo1"
      class="title-icon"
    ></Icon>
    <div style="text-align: center; margin-top: 1em">暂无倒数日</div>
    <a-empty :description="null" :image="simpleImage" />
  </div>
  <div class="card content" style="height: 14em; margin-bottom: 1em" v-else>
    <Icon
      style="width: 2em; height: 2em"
      icon="gengduo1"
      class="title-icon"
    ></Icon>
    <div
      style="
        text-align: center;
        margin-top: 0.7em;
        display: flex;
        font-size: 1.5em;
      "
    >
      距离「
      <span class="text-more" style="flex: 1; width: 0">{{
        countdownDay[0].eventValue
      }}</span
      >」还有
    </div>
    <div style="font-size: 3em; margin-top: 0.1em">
      {{
        transDate(
          appDate.year + "-" + appDate.month + "-" + appDate.day,
          countdownDay[0].dateValue.year +
            "-" +
            countdownDay[0].dateValue.month +
            "-" +
            countdownDay[0].dateValue.day
        )
      }}天
    </div>
    <div style="font-size: 1.5em; margin-top: 0.5em">
      {{ countdownDay[0].dateValue.year }}年{{
        countdownDay[0].dateValue.month
      }}月{{ countdownDay[0].dateValue.day }}日
    </div>
  </div>
</template>

<script>
import { Empty } from "ant-design-vue";
import { mapWritableState } from "pinia";
import { tableStore } from "../../store";
import { transDate } from "../../../../src/util/dateTime";
export default {
  name: "SmallCountdownDay",
  data() {
    return {
      simpleImage: Empty.PRESENTED_IMAGE_SIMPLE,
    };
  },
  computed: {
    ...mapWritableState(tableStore, ["appDate", "countdownDay"]),
  },
  methods: { transDate },

  mounted() {},
};
</script>

<style scoped lang="scss">
.content {
  position: relative;
  text-align: center;

  .title-icon {
    position: absolute;
    right: 1em;
  }
}
</style>
