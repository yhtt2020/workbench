<template>
  <div
    class="card content"
    style="height: 14em; margin-bottom: 1em"
    v-if="CountdownDay.length <= 0"
  >
    <Icon
      style="width: 2em; height: 2em"
      icon="gengduo1"
      class="titleIcon"
    ></Icon>
    <div style="text-align: center; margin-top: 1em">暂无倒数日</div>
    <a-empty :description="null" :image="simpleImage" />
  </div>
  <div class="card content" style="height: 14em; margin-bottom: 1em" v-else>
    <Icon
      style="width: 2em; height: 2em"
      icon="gengduo1"
      class="titleIcon"
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
        CountdownDay[0].EventValue
      }}</span
      >」还有
    </div>
    <div style="font-size: 3em; margin-top: 0.1em">
      {{
        TransDate(
          appDate.year + "-" + appDate.month + "-" + appDate.day,
          CountdownDay[0].DateValue.year +
            "-" +
            CountdownDay[0].DateValue.month +
            "-" +
            CountdownDay[0].DateValue.day
        )
      }}天
    </div>
    <div style="font-size: 1.5em; margin-top: 0.5em">
      {{ CountdownDay[0].DateValue.year }}年{{
        CountdownDay[0].DateValue.month
      }}月{{ CountdownDay[0].DateValue.day }}日
    </div>
  </div>
</template>

<script>
import { Empty } from "ant-design-vue";
import { mapWritableState } from "pinia";
import { appStore } from "../../store";
import { TransDate } from "../../../../src/util/dateTime";
export default {
  name: "SmallCountdownDay",
  data() {
    return {
      simpleImage: Empty.PRESENTED_IMAGE_SIMPLE,
    };
  },
  computed: {
    ...mapWritableState(appStore, ["appDate", "CountdownDay"]),
  },
  methods: { TransDate },

  mounted() {},
};
</script>

<style scoped lang="scss">
.content {
  position: relative;
  text-align: center;

  .titleIcon {
    position: absolute;
    right: 1em;
  }
}
</style>
